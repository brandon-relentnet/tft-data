import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Link from "next/link";

export default function Navigation() {
  return (
    <Navbar className="!bg-mantle !text-text" fluid rounded>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink as={Link} href="/">
          Home
        </NavbarLink>
        <NavbarLink as={Link} href="/champions">
          Champions
        </NavbarLink>
        <NavbarLink as={Link} href="/test">
          Testing
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
