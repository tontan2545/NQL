import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { PG_CONNECTION } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InferenceService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(PG_CONNECTION) private readonly pgClient: Client,
  ) {}

  async logInference(id: string, prompt: string, sql: string) {
    const log = await this.prismaService.inferenceLog.create({
      data: { id, sql, prompt },
    });
    return log;
  }

  private async getTableInfoPrompt() {
    const tableInfos = await this.getTableInfo();

    const tableInfoPrompt = Object.entries(tableInfos)
      .map(([tableType, columns]) => {
        return Object.entries(columns)
          .map(([tableName, columns]) => {
            return `${tableType} ${tableName} COLUMN (${columns
              .map((column) => `${column}`)
              .join(', ')})`;
          })
          .join('\n');
      })
      .join('\n');

    return tableInfoPrompt;
  }

  private async getForeignKeyPrompt() {
    const foreignKeys = await this.getForeignKeys();
    const foreignKeyPrompt = `FOREIGN KEYS: ${foreignKeys
      .map(
        (foreignKey) =>
          `${foreignKey.table_name}.${foreignKey.column_name} = ${foreignKey.foreign_table_name}.${foreignKey.foreign_column_name}`,
      )
      .join(', ')}`;
    return foreignKeyPrompt;
  }

  private async getTableInfo(schema = 'public', includeViews = false) {
    const data = await this.pgClient.query<{
      table_name: string;
      column_name: string;
      table_type: 'TABLE' | 'VIEW';
    }>(
      `SELECT columns.table_name, columns.column_name, case WHEN tables.table_type = 'BASE TABLE' THEN 'TABLE' ELSE 'VIEW' END as table_type
      FROM information_schema.columns as columns
      RIGHT JOIN (SELECT table_name, table_type
        FROM information_schema.tables
      where 1=1
      and table_schema='${schema}'
      ${!includeViews ? "and table_type='BASE TABLE'" : ''}
      ) as tables ON columns.table_name = tables.table_name;`,
    );
    const tableInfo = data.rows.reduce(
      (acc, row) => {
        if (!acc[row.table_type]) acc[row.table_type] = {};
        if (!acc[row.table_type][row.table_name]) {
          acc[row.table_type][row.table_name] = [];
        }
        acc[row.table_type][row.table_name].push(row.column_name);
        return acc;
      },
      {} as Record<'TABLE' | 'VIEW', Record<string, string[]>>,
    );
    return tableInfo;
  }

  private async getForeignKeys() {
    const foreignKeys = await this.pgClient.query<{
      table_name: string;
      column_name: string;
      foreign_table_name: string;
      foreign_column_name: string;
    }>(
      `SELECT
          tc.table_name, 
          kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
      FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'`,
    );
    return foreignKeys.rows;
  }

  async buildPrompt(question: string, topK: number = 10) {
    const tableInfo = await this.getTableInfoPrompt();
    const foreignKeys = await this.getForeignKeyPrompt();
    const prompt = `#### You are a PostgreSQL expert. Given an input question, first create a syntactically correct PostgreSQL query to run, then look at the results of the query and return the answer to the input question.
    Unless the user specifies in the question a specific number of examples to obtain, query for at most ${topK} results using the LIMIT clause as per PostgreSQL. You can order the results to return the most informative data in the database.
    Never query for all columns from a table. You must query only the columns that are needed to answer the question. Wrap each column name in double quotes (") to denote them as delimited identifiers.
    Pay attention to use only the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, pay attention to which column is in which table.
    Pay attention to use CURRENT_DATE function to get the current date, if the question involves "today".
    If the question ask for a keyword search, always use LIKE syntax, case-insensitive syntax (%), and LOWER() function. Never use equals sign for a keyword search. Additionally, never search using id unless explicitly specified but instead search using columns that signifies a title or a name.
    Unless the user specifies the result to return an id, you should return legible results like name or title instead of ids. Join the necessary tables in order to get the name.
    
    
    ## Only use the following tables:
    
    ${tableInfo}
    
    ${foreignKeys}
    
    ## QUESTION: How many customers are from Canada?
    ## SQL: SELECT COUNT(*) FROM customer c JOIN address a ON c.address_id = a.address_id JOIN city ci ON a.city_id = ci.city_id JOIN country co ON ci.country_id = co.country_id WHERE co.country = 'Canada'
    
    ## Question: ${question}`;
    return `${AnthropicBedrock.HUMAN_PROMPT}${prompt}\n${AnthropicBedrock.AI_PROMPT}## SQL:SELECT`;
  }
}
