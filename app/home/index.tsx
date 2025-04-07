import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Categories from "@/components/categories";
import { apiCall } from "@/api";
import { Hit } from "@/types/api";
import ImageGrid from "@/components/image-grid";

import { debounce, set } from "lodash";
import { logBanner } from "@/utils/logger";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import FilterModal from "@/components/filter-modal";
import { useRouter } from "expo-router";

let page = 1;

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const searchInputRef = useRef<TextInput>(null);
  const [images, setImages] = useState<Hit[]>([]);
  const modalRef = useRef<BottomSheetModal>(null);
  const [filters, setFilters] = useState<Record<
    string,
    string | null
  > | null | null>(null);
  const filtersRef = useRef<Record<string, string | null> | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [isEndReached, setIsEndReached] = useState(false);

  useEffect(() => {
    if (filters) {
      filtersRef.current = filters;
    }
  }, [filters]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (
    params: any = { page: 1 },
    append: boolean = true
  ) => {
    logBanner("params", { params, append });
    let res = await apiCall({ ...params });

    if (res.status === 200 && res.data.hits) {
      if (append) {
        setImages([...images, ...res.data.hits]);
      } else {
        setImages([...res.data.hits]);
      }
    }
  };

  const openFilterModal = () => modalRef.current?.present();
  const closeFilterModal = () => modalRef.current?.close();

  const applyFilters = () => {
    if (filters) {
      page = 1;
      setImages([]);
      let params: { page: number; q?: string; category?: string } = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModal();
  };

  const resetFilters = () => {
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params: { page: number; q?: string; category?: string } = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModal();
  };

  const handleActiveCategory = (cat: string | null) => {
    setActiveCategory(cat);
    setSearch("");
    searchInputRef.current?.clear(); // clear visible input

    page = 1;
    setImages([]);

    let params: { page: number; q?: string; category?: string } = {
      page,
      ...filters,
    };

    if (cat) params.category = cat;

    fetchImages(params, false);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    setActiveCategory(null);
    page = 1;

    const currentFilters = filtersRef.current || {};

    if (text.length > 2 || text === "") {
      if (text === "") {
        searchInputRef.current?.clear();
      }

      setImages([]);

      let params: { page: number; q?: string; category?: string } = {
        page,
        ...currentFilters,
      };

      if (text) {
        params.q = text;
      }

      logBanner("filters at search", currentFilters);
      logBanner("params", { params, append: false });

      fetchImages(params, false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef.current?.clear();

    page = 1;
    setImages([]);

    let params: { page: number; q?: string; category?: string } = {
      page,
      ...filters,
    };

    if (activeCategory) params.category = activeCategory;

    fetchImages(params, false);
  };

  logBanner("filters", filters);

  const clearThisFilter = (filterName: string) => {
    let updatedFilters = { ...filters };
    delete updatedFilters[filterName];
    setFilters(updatedFilters);
    page = 1;
    setImages([]);
    let params: { page: number; q?: string; category?: string } = {
      page,
      ...updatedFilters,
    };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  };

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentHeight = event.nativeEvent.contentSize.height;
      const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
      const scrollOffset = event.nativeEvent.contentOffset.y;
      const bottomPosition = contentHeight - scrollViewHeight;

      if (scrollOffset > bottomPosition - 1) {
        if (!isEndReached) {
          setIsEndReached(true);
          logBanner("isEndReached", isEndReached);

          // fetch more images
          ++page;
          let params: { page: number; q?: string; category?: string } = {
            page,
            ...filters,
          };

          if (activeCategory) params.category = activeCategory;
          if (search) params.q = search;
          fetchImages(params);
        }
      } else if (isEndReached) {
        setIsEndReached(false);
      }
    },
    [isEndReached, filters, activeCategory, search]
  );

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({ y: 0, animated: true });
  };

  const handleTxetDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>

        <Pressable onPress={openFilterModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5} // ==> 5ms debounce scroll events i.e when user scrolls, how often scroll event is fired
        ref={scrollRef}
        contentContainerStyle={{ gap: 15 }}
      >
        {/* Search bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={22}
              color={theme.colors.neutral(0.4)}
            />
          </View>

          <TextInput
            placeholder="Search for photos"
            style={styles.searchInput}
            onChangeText={handleTxetDebounce}
            ref={searchInputRef}
          />
          {search && (
            <Pressable style={styles.closeIcon} onPress={clearSearch}>
              <Ionicons
                name="close"
                size={22}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            onActiveCategory={handleActiveCategory}
          />
        </View>

        {/* Applied Filters */}
        {filters && (
          <View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {Object.keys(filters).map((filterName) => {
                return (
                  <View key={filterName} style={styles.filterItem}>
                    {filterName === "colors" ? (
                      <View
                        style={[
                          styles.colorFilter,
                          { backgroundColor: filters[filterName]! },
                        ]}
                      />
                    ) : (
                      <Text style={styles.filterItemText}>
                        {filters[filterName]}
                      </Text>
                    )}
                    <Pressable
                      style={styles.filterCloseIcon}
                      onPress={() => clearThisFilter(filterName)}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.colors.neutral(0.9)}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Images */}
        <View>
          {images.length > 0 && <ImageGrid router={router} images={images} />}
        </View>

        {/* Loading */}
        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onApply={applyFilters}
        onReset={resetFilters}
        onClose={closeFilterModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },

  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },

  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: 6,
    paddingLeft: 10,
  },

  searchIcon: {
    padding: 8,
  },

  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },

  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },

  categories: {},

  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },

  filterItem: {
    backgroundColor: theme.colors.grayBG,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.xs,
    gap: 10,
    paddingHorizontal: 10,
  },

  filterItemText: {
    fontSize: hp(1.8),
  },

  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  },

  colorFilter: {
    height: 20,
    width: 30,
    borderRadius: 7,
  },
});

export default HomeScreen;
