import asyncio
from agent import graph  # change "app" if your file is named differently
from langchain_core.messages import HumanMessage

async def test():
    async for event in graph.astream_events(
        {"messages": [HumanMessage(content="Tell me properties in Gujarat")]},
        version="v2",
        config={"configurable": {"thread_id": "shell-test-1"}}
    ):
        node_name = event.get("metadata", {}).get("langgraph_node", "NONE")
        print(event["event"], "|", node_name)

asyncio.run(test())