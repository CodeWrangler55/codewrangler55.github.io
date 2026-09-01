# The Productivity Gain That Never Reaches the P&L

AI can make a task faster and still fail to improve the business.

Bill Gates has described the near-term value of AI as helping people do their jobs more efficiently. That is real. But efficiency is not automatically capacity.

## A faster task is not the same as more throughput

I keep seeing productivity claims measured inside a task: the draft took less time, the agent answered faster, the analyst completed the form in fewer minutes.

Those numbers can be true while the backlog continues to grow. Review work may absorb the savings. Demand may rise. A different workstation may become the bottleneck. Or the organization may never decide what to do with the time it recovered.

The business measure is not task speed. It is flow: how much finished work moves through the system, how much work is waiting, and where the constraint has moved.

## Throughput is a system property

The [Throughput Strategy Game](https://github.com/michelin/Throughput-Strategy-Game) from Michelin is a useful way to make this visible. Its focus is maximizing finished work while limiting work in progress. That is a much better frame for AI productivity than a single before-and-after time measurement.

The game makes two lessons hard to ignore. Total throughput cannot exceed the capacity of the slowest workstation. And when work requires several probabilistic steps, small failure rates compound quickly. A 90% success rate at each of five steps produces less than 60% end-to-end success.

![Two lessons from Michelin's Throughput Strategy Game](https://codewrangler55.github.io/assets/blog/throughput-lessons.png)

*Screenshot from the video [Throughput Strategy Game](https://www.youtube.com/watch?v=6v4X7XxZH5I).*

![Throughput Strategy Game gameplay overview](https://codewrangler55.github.io/assets/blog/throughput-in-a-nutshell.png)

*Screenshot from the video [Throughput Strategy Game](https://www.youtube.com/watch?v=6v4X7XxZH5I).*

## Convert saved time into a decision

An AI implementation should make the capacity conversion explicit. Does the saved time create faster service, more completed work, lower overtime, better quality control, or simply more room for demand to expand?

That answer requires operating design. It may mean changing staffing, moving work to a newly exposed constraint, reducing review burden, or protecting the recovered capacity from being consumed by low-value work.

The model does not decide what saved time becomes. Leaders do. That is why AI productivity is ultimately a CEO and CFO question, not just a tooling question.
