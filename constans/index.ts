export const headerLinks = [
  {
    label: "Home",
    route: "/",
    roles: ["user", "admin"], // semua user bisa lihat
  },
  {
    label: "Events",
    route: "#events",
    roles: ["user", "admin"], // semua user bisa lihat
  },
  {
    label: "Create Event",
    route: "/events/create",
    roles: ["admin"], // hanya admin
  },
  {
    label: "My Profile",
    route: "/profile",
    roles: ["admin", "user"], // semua user
  },
];

export const eventDefaultValues = {
  title: "",
  description: "",
  location: "",
  imageUrl: "",
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: "",
  price: "",
  isFree: false,
  url: "",
};
