import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout, fetchBankAccounts } from "@/store/userSlice";
import BankAccountCard from "@/components/BankAccountCard";
import DrawerMenu from "@/components/DrawerMenu";
import HamburgerButton from "@/components/HamburgerButton";
import {
  BankCardsSkeleton,
  QuickActionsSkeleton,
} from "@/components/SkeletonLoader";

const HomeScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id, name, bankAccounts, loading } = useAppSelector(
    (state) => state.user
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch bank accounts when component mounts (prevent duplicate calls)
  React.useEffect(() => {
    if (id && bankAccounts.length === 0 && !loading) {
      dispatch(fetchBankAccounts(id));
    }
  }, [id, bankAccounts.length, loading, dispatch]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          dispatch(logout());
          router.replace("/");
        },
      },
    ]);
  };

  const quickActions = [
    {
      title: "Transfer Money",
      description: "Send money to your contacts instantly",
      icon: "💸",
    },
    {
      title: "Pay Bills",
      description: "Manage and pay your monthly bills",
      icon: "📄",
    },
    {
      title: "Deposit Check",
      description: "Take a photo to deposit checks",
      icon: "📷",
    },
    {
      title: "Find ATMs",
      description: "Locate nearby ATMs and branches",
      icon: "🏧",
    },
  ];

  const renderBankCard = ({ item, index }: { item: any; index: number }) => (
    <BankAccountCard account={item} index={index} />
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <HamburgerButton onPress={toggleDrawer} isOpen={isDrawerOpen} />
            </Animated.View>

            <View style={styles.centerContent}>
              <Animated.Text
                entering={FadeInDown.delay(400).springify()}
                style={styles.greeting}
              >
                Good day! 👋
              </Animated.Text>
              <Animated.Text
                entering={FadeInDown.delay(600).springify()}
                style={styles.userName}
              >
                {name}
              </Animated.Text>
            </View>

            <Animated.View entering={FadeInDown.delay(800).springify()}>
              <Pressable style={styles.notificationButton}>
                <Text style={styles.notificationIcon}>🔔</Text>
              </Pressable>
            </Animated.View>
          </View>

          <Animated.Text
            entering={FadeInDown.delay(1000).springify()}
            style={styles.welcomeMessage}
          >
            Welcome to your personal dashboard
          </Animated.Text>
        </View>

        <View style={styles.accountsSection}>
          <Animated.Text
            entering={FadeInDown.delay(1000).springify()}
            style={styles.sectionTitle}
          >
            Your Accounts
          </Animated.Text>
          {!loading && (
            <Animated.Text
              entering={FadeInDown.delay(1100).springify()}
              style={styles.sectionSubtitle}
            >
              Swipe to view all your accounts
            </Animated.Text>
          )}

          {loading ? (
            <BankCardsSkeleton />
          ) : bankAccounts.length > 0 ? (
            <FlatList
              data={bankAccounts}
              renderItem={renderBankCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsContainer}
              snapToInterval={wp(85) + 16}
              decelerationRate="fast"
              snapToAlignment="center"
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No bank accounts found</Text>
              <Text style={styles.emptySubtext}>
                Contact support to add accounts
              </Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {loading ? (
            <>
              <Animated.Text
                entering={FadeInDown.delay(1400).springify()}
                style={styles.sectionTitle}
              >
                Quick Actions
              </Animated.Text>
              <QuickActionsSkeleton />
            </>
          ) : (
            <>
              <Animated.Text
                entering={FadeInDown.delay(1400).springify()}
                style={styles.sectionTitle}
              >
                Quick Actions
              </Animated.Text>

              {quickActions.map((action, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInDown.delay(1600 + index * 100).springify()}
                  style={styles.actionCard}
                >
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionDescription}>
                      {action.description}
                    </Text>
                  </View>
                  <Text style={styles.actionArrow}>→</Text>
                </Animated.View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <DrawerMenu isVisible={isDrawerOpen} onClose={closeDrawer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
  },
  greeting: {
    fontSize: hp(2.2),
    color: theme.colors.neutral(0.7),
    fontWeight: theme.fontWeights.medium,
    textAlign: "center",
  },
  userName: {
    fontSize: hp(3.5),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold,
    marginTop: 4,
    textAlign: "center",
  },
  notificationButton: {
    width: 44,
    height: 44,
    backgroundColor: theme.colors.neutral(0.1),
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.neutral(0.3),
  },
  notificationIcon: {
    fontSize: hp(2.2),
  },

  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: hp(2.2),
    color: theme.colors.neutral(0.7),
    fontWeight: theme.fontWeights.semibold,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: hp(1.8),
    color: theme.colors.neutral(0.5),
    fontWeight: theme.fontWeights.medium,
  },
  welcomeMessage: {
    fontSize: hp(2),
    color: theme.colors.neutral(0.6),
    fontWeight: theme.fontWeights.medium,
    lineHeight: hp(2.6),
  },
  accountsSection: {
    paddingBottom: 30,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: hp(2.8),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  sectionSubtitle: {
    fontSize: hp(1.7),
    color: theme.colors.neutral(0.6),
    fontWeight: theme.fontWeights.medium,
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  actionCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.grayBG,
    padding: 20,
    borderRadius: theme.radius.lg,
    marginBottom: 12,
    alignItems: "center",
  },
  actionIcon: {
    fontSize: hp(3),
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: hp(2.1),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.semibold,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: hp(1.7),
    color: theme.colors.neutral(0.6),
    fontWeight: theme.fontWeights.medium,
    lineHeight: hp(2.2),
  },
  actionArrow: {
    fontSize: hp(2.5),
    color: theme.colors.neutral(0.4),
    fontWeight: theme.fontWeights.bold,
  },
  aboutButton: {
    backgroundColor: theme.colors.neutral(0.9),
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: theme.radius.lg,
    marginTop: 24,
    alignSelf: "center",
  },
  aboutButtonText: {
    color: theme.colors.white,
    fontSize: hp(2),
    fontWeight: theme.fontWeights.semibold,
    textAlign: "center",
  },
});

export default HomeScreen;
