# Connect

Connect is a social media application for finding and forming connections, chatting in real time, and sharing posts.

## Build

Connect was built with TypeScript, Nodejs, Express, React, React-Router, Redux-Toolkit, CSS, Neo4j, MongoDB, Cassandra, and Socket.io.

Databases are hosted using cloud providers:

Neo4j - AstraDB.

MongoDB - Atlas.

Cassandra - DataStax Astro.

## Features

- Real-time chat in one-on-one and user-created chat groups.
- The ability to find and connect with people in your network.
  - Uses proximity search to find second-degree connections by leveraging Neo4j's graph data model.
- A user feed that shows posts of people you follow
  - connecting with and following people are separate actions, giving users fine-tuned control over whose posts they see in their feed.
- Scalable, low-latency message storing via Cassandra.
- Scalable post storage via MongoDB.
- A custom rich text editor to enable content formatting on long-form user posts.
- Progressive Web App functionality, including installability and push notifications.
- The ability to block and un-block users.
- Combined short-form and long form user posts
  - Initial post has a character limit similar to tweets, and is the only portion of a post that is initially displayed.
  - Longer form content can be included, which a user can view by clicking "read more".
  - Outside links can be added to posts.

## Future Plans

- Leverage Neo4j's sharding and federating capabilities to more effectively scale and store user posts and enable scalable storage of comment threads.
