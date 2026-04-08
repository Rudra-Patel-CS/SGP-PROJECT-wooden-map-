export const MAP_SIZES = [
  { id: "xs", label: "XS", dimensions: "38 x 24 IN", price: 8000 },
  { id: "s", label: "S", dimensions: "48 x 30 IN", price: 11000 },
  { id: "m", label: "M", dimensions: "60 x 38 IN", price: 15500 },
  { id: "l", label: "L", dimensions: "72 x 46 IN", price: 19000 },
  { id: "xl", label: "XL", dimensions: "84 x 53 IN", price: 23000 },
  { id: "xxl", label: "XXL", dimensions: "100 x 64 IN", price: 35000 },
];

export const getSizeById = (id: string) => MAP_SIZES.find(s => s.id === id);

export const normalizeSizeId = (size: string): string => {
  const s = size?.toLowerCase() || "all";
  if (s === "all") return "all";
  if (s === "small") return "xs";
  if (s === "medium") return "m";
  if (s === "large") return "l";
  if (s === "extra large" || s === "extra-large") return "xl";
  return s; 
};

export const getDefaultPriceForSize = (sizeId: string): number => {
  const id = normalizeSizeId(sizeId);
  if (id === "all") return 8000; // XS is default for 'all'
  const sizeData = MAP_SIZES.find(s => s.id === id);
  return sizeData ? sizeData.price : 8000;
};
