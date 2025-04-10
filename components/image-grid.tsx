import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Hit } from "@/types/api";

import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./image-card";
import { getColumnCount, wp } from "@/helpers/common";
import { Router } from "expo-router";

const ImageGrid = ({ images, router }: { images: Hit[]; router: Router }) => {
  const column = getColumnCount();
  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={column}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <ImageCard
            item={item}
            router={router}
            index={index}
            column={column!}
          />
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },

  listContainer: {
    paddingHorizontal: wp(4),
  },
});

export default ImageGrid;
