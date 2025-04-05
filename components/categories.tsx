import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import React from "react";
import { data } from "@/constants/data";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Animated, { FadeInRight } from "react-native-reanimated";

interface Props {
  activeCategory: string | null;
  onActiveCategory: (cat: string | null) => void;
}

const Categories = ({ activeCategory, onActiveCategory }: Props) => {
  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.flatListContainer}
      showsHorizontalScrollIndicator={false}
      data={data.categories}
      keyExtractor={(item) => item}
      renderItem={({ item, index }) => (
        <CategoryItem
          isActive={activeCategory === item}
          title={item}
          index={index}
          handleChangeCategory={onActiveCategory}
        />
      )}
    />
  );
};

const CategoryItem = ({
  title,
  isActive,
  index,
  handleChangeCategory,
}: {
  title: string;
  isActive: boolean;
  index: number;
  handleChangeCategory: (cat: string | null) => void;
}) => {
  let color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
  let backgroundColor = isActive
    ? theme.colors.neutral(0.8)
    : theme.colors.white;

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 200)
        .duration(1000)
        .springify()
        .damping(14)}
    >
      <Pressable
        onPress={() => handleChangeCategory(isActive ? null : title)}
        style={[styles.category, { backgroundColor }]}
      >
        <Text style={[styles.title, { color }]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: wp(4),
    gap: 8,
  },

  category: {
    padding: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    // backgroundColor: theme.colors.white,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },

  title: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.semibold,
  },
});

export default Categories;
