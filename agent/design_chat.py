import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from agent.rag_agent import agent

print("Design Intelligence Agent Ready")

while True:

    q = input("> ")

    if q.lower() in ["exit", "quit"]:
        print("Goodbye!")
        break

    print("Thinking...\n")

    result = agent.run(q)

    print(result)