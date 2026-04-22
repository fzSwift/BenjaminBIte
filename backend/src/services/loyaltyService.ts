import { IUserDocument } from "../models/User";

export const isPointsExpired = (user: IUserDocument): boolean => {
  if (!user.pointsExpiryDate) return false;
  return user.pointsExpiryDate.getTime() < Date.now();
};

export const earnPoints = async (user: IUserDocument, amountSpent: number): Promise<void> => {
  if (isPointsExpired(user)) {
    user.pointsBalance = 0;
    user.bonusPoints = 0;
  }

  const earnedPoints = Math.floor(amountSpent);
  user.pointsBalance += earnedPoints;
  user.pointsExpiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  user.updateTier();
  await user.save();
};

export const redeemPoints = async (
  user: IUserDocument,
  pointsToRedeem: number,
  orderTotal: number
): Promise<{ updatedTotal: number; redeemed: number }> => {
  if (isPointsExpired(user)) {
    user.pointsBalance = 0;
    user.bonusPoints = 0;
    user.updateTier();
    await user.save();
    throw new Error("Points have expired");
  }

  if (pointsToRedeem <= 0) throw new Error("Points must be greater than zero");
  if (user.pointsBalance < pointsToRedeem) throw new Error("Insufficient points balance");

  const usablePoints = Math.min(pointsToRedeem, Math.floor(orderTotal));
  user.pointsBalance -= usablePoints;
  user.updateTier();
  await user.save();

  return {
    updatedTotal: Math.max(0, orderTotal - usablePoints),
    redeemed: usablePoints
  };
};
