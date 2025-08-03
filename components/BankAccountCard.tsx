import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { BankAccount } from "@/store/userSlice";
import Animated, { FadeInDown } from "react-native-reanimated";

interface BankAccountCardProps {
  account: BankAccount;
  index: number;
}

const BankAccountCard = ({ account, index }: BankAccountCardProps) => {
  const formatBalance = (balance: number, currency: string) => {
    const isNegative = balance < 0;
    const formattedAmount = Math.abs(balance).toLocaleString("en-US", {
      style: "currency",
      currency: currency,
    });
    return isNegative ? `-${formattedAmount}` : formattedAmount;
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case "Checking":
        return "💳";
      case "Savings":
        return "🏦";
      case "Credit":
        return "💎";
      default:
        return "💳";
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(300 + index * 100).springify()}
      style={[styles.card, { backgroundColor: account.cardColor }]}
    >
      <View style={styles.header}>
        <View style={styles.bankInfo}>
          <Text style={styles.bankName}>{account.bankName}</Text>
          <Text style={styles.accountType}>
            {getAccountTypeIcon(account.accountType)} {account.accountType}
          </Text>
        </View>
        <View style={styles.chip} />
      </View>

      <View style={styles.middle}>
        <Text style={styles.balance}>
          {formatBalance(account.balance, account.currency)}
        </Text>
        <Text style={styles.balanceLabel}>Available Balance</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.accountNumber}>{account.accountNumber}</Text>
        <View style={styles.cardLogo}>
          <Text style={styles.logoText}>VISA</Text>
        </View>
      </View>

      <View style={styles.pattern}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: wp(85),
    height: hp(25),
    borderRadius: theme.radius.xl,
    padding: 24,
    marginHorizontal: 8,
    position: "relative",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    color: "white",
    fontSize: hp(2.2),
    fontWeight: theme.fontWeights.bold,
    marginBottom: 4,
  },
  accountType: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: hp(1.7),
    fontWeight: theme.fontWeights.medium,
  },
  chip: {
    width: 32,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
  },
  middle: {
    flex: 1,
    justifyContent: "center",
  },
  balance: {
    color: "white",
    fontSize: hp(3.2),
    fontWeight: theme.fontWeights.bold,
    marginBottom: 4,
  },
  balanceLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: hp(1.6),
    fontWeight: theme.fontWeights.medium,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountNumber: {
    color: "white",
    fontSize: hp(2),
    fontWeight: theme.fontWeights.semibold,
    letterSpacing: 2,
  },
  cardLogo: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  logoText: {
    color: "white",
    fontSize: hp(1.4),
    fontWeight: theme.fontWeights.bold,
  },
  pattern: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  circle: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 100,
  },
  circle1: {
    width: 120,
    height: 120,
    top: -30,
    right: -30,
  },
  circle2: {
    width: 80,
    height: 80,
    bottom: -20,
    right: 20,
  },
});

export default BankAccountCard;
