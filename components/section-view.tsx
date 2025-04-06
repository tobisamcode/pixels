import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { FunctionComponent, ReactNode } from "react";
import { capitalizeWords, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { ContentProps } from "./filter-modal";

const SectionView = ({
  title,
  content,
}: {
  title: string;
  content: ReactNode;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );
};

export const CommonFilterRow = ({
  data,
  filters,
  setFilters,
  filterName,
}: any) => {
  const onSelect = (item: string) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item: any) => {
          let isActive = filters && filters[filterName] === item;
          let backgroundColor = isActive
            ? theme.colors.neutral(0.7)
            : theme.colors.white;
          let color = isActive ? theme.colors.white : theme.colors.neutral(0.7);

          return (
            <Pressable
              onPress={() => onSelect(isActive ? null : item)}
              key={item}
              style={[styles.outlinedButton, { backgroundColor }]}
            >
              <Text style={[styles.outlinedButtonText, { color }]}>
                {capitalizeWords(item)}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.9),
  },

  flexRowWrap: {
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  outlinedButton: {
    padding: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs,
    borderCurve: "continuous",
  },

  outlinedButtonText: {},
});

export default SectionView;
