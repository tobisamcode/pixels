import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { logBanner } from "@/utils/logger";

const SectionView = ({ title, content }: { title: string; content: any }) => {
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
  return (
    <View>
      <Text>
        {data &&
          data.map((item: any) => {
            return (
              <Pressable key={item}>
                <Text>{item}</Text>
              </Pressable>
            );
          })}
      </Text>
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
});

export default SectionView;
