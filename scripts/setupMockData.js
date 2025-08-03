// Script to populate MockAPI.io with initial data
// Run this with: node scripts/setupMockData.js

const BASE_URL = "https://6799de9f1169123a8e2bc926.mockapi.io/api/v1";

const users = [
  {
    username: "john.doe",
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    username: "jane.smith",
    name: "Jane Smith",
    email: "jane.smith@example.com",
  },
  {
    username: "demo",
    name: "Demo User",
    email: "demo@example.com",
  },
];

const bankAccounts = [
  // John Doe's accounts
  {
    userId: "1",
    accountNumber: "****1234",
    accountType: "Checking",
    balance: 5420.5,
    currency: "USD",
    cardColor: "#6366f1",
    bankName: "Premier Bank",
  },
  {
    userId: "1",
    accountNumber: "****5678",
    accountType: "Savings",
    balance: 12750.0,
    currency: "USD",
    cardColor: "#10b981",
    bankName: "Premier Bank",
  },
  {
    userId: "1",
    accountNumber: "****9012",
    accountType: "Credit",
    balance: -2340.75,
    currency: "USD",
    cardColor: "#f59e0b",
    bankName: "Premier Credit",
  },
  // Jane Smith's accounts
  {
    userId: "2",
    accountNumber: "****3456",
    accountType: "Checking",
    balance: 8720.25,
    currency: "USD",
    cardColor: "#8b5cf6",
    bankName: "Metro Bank",
  },
  {
    userId: "2",
    accountNumber: "****7890",
    accountType: "Savings",
    balance: 25430.8,
    currency: "USD",
    cardColor: "#06b6d4",
    bankName: "Metro Bank",
  },
  // Demo user's accounts
  {
    userId: "3",
    accountNumber: "****1111",
    accountType: "Checking",
    balance: 1250.0,
    currency: "USD",
    cardColor: "#ef4444",
    bankName: "City Bank",
  },
];

async function setupMockData() {
  try {
    console.log("Setting up mock data...");

    // Create users
    console.log("Creating users...");
    const createdUsers = [];
    for (const user of users) {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const createdUser = await response.json();
        createdUsers.push(createdUser);
        console.log(`✅ Created user: ${user.name} (ID: ${createdUser.id})`);
      } else {
        console.log(`❌ Failed to create user: ${user.name}`);
      }
    }

    // Create bank accounts with correct user IDs
    console.log("Creating bank accounts...");
    for (let i = 0; i < bankAccounts.length; i++) {
      const account = { ...bankAccounts[i] };

      // Update userId to match created user ID
      if (createdUsers[parseInt(account.userId) - 1]) {
        account.userId = createdUsers[parseInt(account.userId) - 1].id;
      }

      const response = await fetch(`${BASE_URL}/bankAccounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
      });

      if (response.ok) {
        const createdAccount = await response.json();
        console.log(
          `✅ Created account: ${account.accountType} ${account.accountNumber} for user ${account.userId}`
        );
      } else {
        console.log(
          `❌ Failed to create account: ${account.accountType} ${account.accountNumber}`
        );
      }
    }

    console.log("🎉 Mock data setup complete!");
    console.log("\nTest credentials:");
    console.log("- Username: john.doe (any password)");
    console.log("- Username: jane.smith (any password)");
    console.log("- Username: demo (any password)");
  } catch (error) {
    console.error("Error setting up mock data:", error);
  }
}

setupMockData();
