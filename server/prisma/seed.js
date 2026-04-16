import { prisma } from '../src/lib/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Clearing existing data...');

  // Clear existing data
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding database with tech-related content...');

  // Use a single password for easy testing
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create 10 users
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        email: `user${i}@example.com`,
        name: `User ${i}`,
        password: hashedPassword,
      },
    });
    users.push(user);
  }

  console.log('Created 10 users');

  // Tech-related post data
  const postData = [
    { title: "Introduction to React Hooks", content: "React Hooks are functions that let you use state and other React features in functional components. This post covers useState, useEffect, and custom hooks with practical examples." },
    { title: "Node.js Best Practices", content: "Learn essential Node.js best practices including error handling, async/await patterns, middleware usage, and performance optimization techniques for scalable applications." },
    { title: "Database Design Principles", content: "Explore fundamental database design principles including normalization, indexing strategies, and relationship modeling for efficient data storage and retrieval." },
    { title: "REST API Security", content: "Comprehensive guide to securing REST APIs with JWT authentication, input validation, rate limiting, and common security vulnerabilities to avoid." },
    { title: "Microservices Architecture", content: "Understanding microservices architecture patterns, service communication, data consistency, and deployment strategies for modern applications." },
    { title: "TypeScript for JavaScript Developers", content: "Transition from JavaScript to TypeScript with type annotations, interfaces, generics, and advanced features that improve code quality and developer experience." },
    { title: "Docker Containerization", content: "Master Docker fundamentals including container creation, Docker Compose for multi-service applications, and best practices for production deployments." },
    { title: "GraphQL vs REST APIs", content: "Compare GraphQL and REST API approaches, understanding when to use each, query optimization, and schema design principles." },
    { title: "Redis Caching Strategies", content: "Implement effective caching strategies with Redis including cache-aside, write-through patterns, TTL management, and performance monitoring." },
    { title: "CI/CD Pipeline Setup", content: "Build robust CI/CD pipelines using GitHub Actions, automated testing, deployment strategies, and monitoring for reliable software delivery." },
    { title: "Machine Learning with Python", content: "Introduction to machine learning concepts using Python, covering data preprocessing, model training, and evaluation metrics." },
    { title: "Blockchain Fundamentals", content: "Explore blockchain technology basics including decentralized networks, smart contracts, and cryptocurrency concepts." },
    { title: "Cybersecurity Essentials", content: "Learn fundamental cybersecurity principles including encryption, secure coding practices, and common attack vectors to protect applications." },
    { title: "Progressive Web Apps", content: "Build modern web applications with PWA features including offline support, push notifications, and native app-like experiences." },
    { title: "Serverless Computing", content: "Understand serverless architecture with AWS Lambda, function optimization, event-driven design, and cost-effective scaling strategies." },
  ];

  // Create 15 posts, distributed among users
  const postDistribution = [3, 2, 2, 1, 1, 1, 1, 1, 1, 2]; // Sum to 15
  let postIndex = 0;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const numPosts = postDistribution[i];
    for (let j = 0; j < numPosts; j++) {
      const postInfo = postData[postIndex % postData.length];
      await prisma.post.create({
        data: {
          title: postInfo.title,
          content: postInfo.content,
          mediaURL: j % 2 === 0 ? `https://example.com/tech-image${postIndex + 1}.jpg` : null,
          userId: user.id,
        },
      });
      postIndex++;
    }
  }

  console.log('Created 15 tech-related posts');
  console.log('Seeding completed! All users have password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });