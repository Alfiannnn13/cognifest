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
    route: "/my-profile",
    roles: ["admin", "user"], // hanya admin
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
  quota: 1,
};
