import { UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import config from "../../config";
import prisma from "../../shared/prisma";

const seedAdmin = async () => {
  const admin = {
    name: config.admin.admin_name!,
    email: config.admin.admin_email!,
    password: await bcrypt.hash(config.admin.admin_password!, 10),
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
  }
};

export default seedAdmin;
