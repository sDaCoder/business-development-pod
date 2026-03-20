# from agents.biz_agent import biz_agent
from agents.design_agent import design_agent
from agents.dev_agent import dev_agent
from agents.test_agent import test_agent
from strands.multiagent import GraphBuilder
    
def create_graph_agent():
    graph = GraphBuilder()
    
    # graph.add_node(biz_agent, "business-analyst")
    graph.add_node(design_agent, "designer")
    graph.add_node(dev_agent, "developer")
    graph.add_node(test_agent, "test-agent")

    graph.set_entry_point("designer")

    # Edges of the graph
    # graph.add_edge("business-analyst", "designer")
    graph.add_edge("designer", "developer")
    graph.add_edge("developer", "test-agent")

    return graph.build()