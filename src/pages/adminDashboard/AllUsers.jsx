import React from "react";
import UsersList from "./UserList";
import PageTitle from "../../components/PageTitle";

export default function AllUsers() {
  return (
    <div>
      <PageTitle title={"All Users"} />
      <UsersList />
    </div>
  );
}
