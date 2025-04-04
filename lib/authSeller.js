import clerk from '@clerk/clerk-sdk-node'; // ✅ use this instead of '@clerk/nextjs/server'

const authSeller = async (userId) => {
  try {
    const user = await clerk.users.getUser(userId);
    console.log("🧠 Clerk User:", user);

    const role = user?.publicMetadata?.role;
    console.log("🔍 role from publicMetadata:", role);

    return role === "seller";
  } catch (error) {
    console.error("❌ Clerk error in authSeller:", error.message);
    return false;
  }
};

export default authSeller;
