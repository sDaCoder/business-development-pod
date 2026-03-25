import time
from boto3.dynamodb.conditions import Key

def save_chat(project_id, user_id, role, message, stage, agent):
    project_table.put_item(
        Item={
            "PK": f"PROJECT#{project_id}",
            "SK": f"CHAT#{time.time()}",
            "user_id": user_id,
            "role": role,              # user / assistant / system
            "message": message,
            "stage": stage,            # business / design / dev / test
            "agent": agent,            # biz_agent / designer / etc.
            "timestamp": str(time.time())
        }
    )


def get_chat_history(project_id):
    response = project_table.query(
        KeyConditionExpression=
            Key("PK").eq(f"PROJECT#{project_id}") &
            Key("SK").begins_with("CHAT#")
    )

    items = response.get("Items", [])
    return sorted(items, key=lambda x: x["SK"])