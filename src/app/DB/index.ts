import { UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import config from "../../config";
import prisma from "../../shared/prisma";

const seedAdmin = async () => {
  const password = config.admin.admin_password;
  if (!password) {
    throw new Error("❌ ADMIN_PASSWORD environment variable is not set.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = {
    name: config.admin.admin_name!,
    email: config.admin.admin_email!,
    password: hashedPassword,
    phoneNumber: config.admin.admin_phone_number!,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    isEmailVerified: true,
  };

  const isAdminExists = await prisma.user.findUnique({
    where: { email: config.admin.admin_email },
  });

  if (!isAdminExists) {
    await prisma.user.create({ data: admin });
    console.log("✅ Admin created successfully!");
  } else {
    console.log("⚠️ Admin already exists.");
  }
};

export default seedAdmin;
