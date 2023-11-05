import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InferenceService {
  constructor(private readonly prismaService: PrismaService) {}

  async logInference(prompt: string, sql: string) {
    const log = await this.prismaService.inferenceLog.create({
      data: { sql, prompt },
    });
    return log;
  }

  buildPrompt(question: string, topK: number = 10) {
    const postgresPrompt = `${AnthropicBedrock.HUMAN_PROMPT}You are a PostgreSQL expert. Given an input question, first create a syntactically correct PostgreSQL query to run, then look at the results of the query and return the answer to the input question.
Unless the user specifies in the question a specific number of examples to obtain, query for at most ${topK} results using the LIMIT clause as per PostgreSQL. You can order the results to return the most informative data in the database.
Never query for all columns from a table. You must query only the columns that are needed to answer the question. Wrap each column name in double quotes (") to denote them as delimited identifiers.
Pay attention to use only the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, pay attention to which column is in which table.
Pay attention to use CURRENT_DATE function to get the current date, if the question involves "today".
If the question ask for a keyword search, always use LIKE syntax, case-insensitive syntax (%), and LOWER() function. Never use equals sign for a keyword search. Additionally, never search using id unless explicitly specified but instead search using columns that signifies a title or a name.
Unless the user specifies the result to return an id, you should return legible results like name or title instead of ids. Join the necessary tables in order to get the name.

Use the following format:

Question: Question here
SQL: SQL Query to run
    
Only use the following tables:
{table_info}

Question: ${question}${AnthropicBedrock.AI_PROMPT} SQL: SELECT`;
    return postgresPrompt;
  }
}
