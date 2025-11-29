https://catalog.us-east-1.prod.workshops.aws/workshops/33f099a6-45a2-47d7-9e3c-a23a6568821e/en-US/00-prerequisites/01-at-an-aws-event

Getting Started with Strands Agents
Getting Started with Strands Agents
Getting Started with Strands Agents
What is Strands Agents?
Strands Agents  is an open source SDK that takes a model-driven approach to building and running AI agents  in just a few lines of code. It provides developers with a streamlined framework to create intelligent agents that can perform a wide range of tasks, from simple interactions to complex multi-agent collaborations.

The SDK simplifies the complexity of agent development, allowing you to focus on defining agent behavior and capabilities rather than worrying about the underlying implementation details. With Strands Agents, you can quickly prototype AI agents that leverage the power of large language models (LLMs) like Amazon Nova Anthropic Claude , and others. Like the two strands of DNA, Strands connects two core pieces of the agent together: the model and the tools.

Features and Benefits
Simplified Agent Development
Strands Agents  accelerates development time by enabling you to create fully functional AI agents with minimal code. Through its intuitive interface, you can define agent behavior using system prompts and tool configurations, allowing for rapid prototyping and iteration. This simplified approach means you can focus on business logic rather than agent infrastructure.

Core concepts of Strands Agents

The simplest definition of an agent is a combination of three things:

a model
tools
a prompt
The agent uses these three components to complete a task. The agent’s task could be to answer a question, generate code, plan a vacation, or optimize your financial portfolio. In a model-driven approach, the agent uses the model to dynamically direct its own steps and to use tools in order to accomplish the specified task.

agentic loop

An agent interacts with its model and tools in a loop until it completes the task provided by the prompt. This agentic loop is at the core of Strands’ capabilities. The Strands agentic loop takes full advantage of how powerful LLMs have become and how well they can natively reason, plan, and select tools. When the LLM selects a tool, Strands takes care of executing the tool and providing the result back to the LLM. When the LLM completes its task, Strands returns the agent’s final result.

Flexible Tool Integration
The SDK offers flexibility in tool integration, supporting both built-in and custom tools. Built-in tools  handle common tasks like calculations and making API requests, and interacting with AWS APIs, while the custom tool framework lets you extend agent capabilities with specialized functions. You can easily use any Python function as a tool, by simply using the Strands @tool decorator. Additionally, Model Context Protocol (MCP)  integration connects your agents to external services and resources, expanding their capabilities without complex coding. This extensibility ensures your agents can adapt to evolving requirements and integrate with existing systems.

Multi-Model Support
Multi-model support is a cornerstone of Strands Agents, giving you the freedom to choose the right foundation for your specific use case. You can use any model in Amazon Bedrock  like Claude 3.7, a model from Anthropic through the Anthropic API, a model from the Llama model family via Llama API, Ollama for local development, and other model providers such as OpenAI through LiteLLM. You can additionally define your own custom model provider with Strands. You can easily switch between different LLM providers and configure model parameters to optimize performance, ensuring your agents leverage the most appropriate AI technology for each task.

Advanced Multi-Agent Architectures
Multi-agent collaboration is a key functionality for agent development. Out-of-the box Strands Agents supports four types of multi-agent collaboration: Agent as Tool , Swarm , Graph  and Workflow . The Agent-as-Tool pattern enables hierarchical structures where specialized agents serve as tools for orchestrator agents, mimicking human team dynamics. Swarm Agents allows you to build multiple agents working in parallel with different collaboration patterns (collaborative, competitive, or hybrid), while Graph Agents allow you to build structured networks of specialized agents with explicit communication patterns. Workflow Agents provide task orchestration capabilities for complex processes with distinct sequential stages, supporting both sequential and parallel execution paths with priority-based scheduling, comprehensive monitoring, and auto-recovery features. These architectures enable sophisticated problem-solving approaches that distribute tasks among specialized components.

Enterprise-Ready Capabilities
The Strands Agents project includes deployment examples  with a set of reference implementations for AWS Lambda, Fargate, and EC2. The SDK supports streaming responses for real-time interactions. Strands uses OpenTelemetry (OTEL) to emit telemetry data to any OTEL-compatible backend for visualization, troubleshooting, and evaluation. Strands’ support for distributed tracing enables you to track requests through different components in your architecture, in order to paint a complete picture of agent sessions. Amazon Bedrock models provide built-in support for guardrails and content filtering capabilities that can be leveraged when using these models with Strands Agents.

Throughout this workshop, we'll explore Strands Agents' capabilities and build practical examples that demonstrate how this SDK can transform your approach to building AI applications.

The workshop follows the official AWS Strands Agents  GitHub repository.
