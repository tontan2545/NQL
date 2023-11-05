from diagrams import Diagram, Cluster, Edge
from diagrams.aws.compute import ElasticContainerService
from diagrams.aws.database import RDS, ElastiCache
from diagrams.aws.analytics import Athena
from diagrams.aws.storage import S3
from diagrams.aws.network import ELB
from diagrams.aws.mobile import Amplify
from diagrams.aws.ml import Sagemaker
from diagrams.generic.storage import Storage


with Diagram("NQL System Architecture", show=False):
    elasticache = ElastiCache("Amazon ElastiCache")
    embedding_layer = Sagemaker("Amazon Bedrock\nCohere Embed")

    with Cluster(
        "Auto Scaling Group",
        graph_attr={
            "bgcolor": "transparent",
            "style": "dashed",
        },
    ):
        ecs_backend = ElasticContainerService("API Server")

    (Amplify("Web UI") >> ELB("Load Balancing") >> ecs_backend)

    with Cluster(
        "Datasource",
        graph_attr={
            "bgcolor": "transparent",
        },
    ):
        athena = Athena("Amazon Athena")
        ecs_backend >> athena
        athena - [RDS("Amazon RDS"), S3("Amazon S3"), Storage("On Prem Database")]

    (
        ecs_backend
        >> Edge(label="Embedding Lookup")
        >> embedding_layer
        >> Edge(label="Prompt Caching")
        >> elasticache
    )

    ecs_backend >> Edge(label="SQL Generation") >> Sagemaker("Amazon Bedrock\nClaude 2")
