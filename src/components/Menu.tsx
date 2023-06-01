"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styled from "styled-components";
import { navLinks } from "@/config";
import { KEY_CODES } from "@/utils";
import { useOnClickOutside } from "@/hooks";

const StyledMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const StyledHamburgerButton = styled.button<{
  $menuOpen: boolean;
}>`
  display: none;

  @media (max-width: 768px) {
    ${({ theme }) => theme.mixins.flexCenter};
    position: relative;
    z-index: 10;
    margin-right: -15px;
    padding: 15px;
    border: 0;
    background-color: transparent;
    color: inherit;
    text-transform: none;
    transition-timing-function: linear;
    transition-duration: 0.15s;
    transition-property: opacity, filter;
  }

  .ham-box {
    display: inline-block;
    position: relative;
    width: var(--hamburger-width);
    height: 24px;
  }

  .ham-box-inner {
    position: absolute;
    top: 50%;
    right: 0;
    width: var(--hamburger-width);
    height: 2px;
    border-radius: var(--border-radius);
    background-color: var(--green);
    transition-duration: 0.22s;
    transition-property: transform;
    transition-delay: ${(props) => (props.$menuOpen ? `0.12s` : `0s`)};
    transform: rotate(${(props) => (props.$menuOpen ? `225deg` : `0deg`)});
    transition-timing-function: cubic-bezier(
      ${(props) =>
        props.$menuOpen ? `0.215, 0.61, 0.355, 1` : `0.55, 0.055, 0.675, 0.19`}
    );
    &:before,
    &:after {
      content: "";
      display: block;
      position: absolute;
      left: auto;
      right: 0;
      width: var(--hamburger-width);
      height: 2px;
      border-radius: 4px;
      background-color: var(--green);
      transition-timing-function: ease;
      transition-duration: 0.15s;
      transition-property: transform;
    }
    &:before {
      width: ${(props) => (props.$menuOpen ? `100%` : `120%`)};
      top: ${(props) => (props.$menuOpen ? `0` : `-10px`)};
      opacity: ${(props) => (props.$menuOpen ? 0 : 1)};
      transition: ${({ $menuOpen }) =>
        $menuOpen ? "var(--ham-before-active)" : "var(--ham-before)"};
    }
    &:after {
      width: ${(props) => (props.$menuOpen ? `100%` : `80%`)};
      bottom: ${(props) => (props.$menuOpen ? `0` : `-10px`)};
      transform: rotate(${(props) => (props.$menuOpen ? `-90deg` : `0`)});
      transition: ${({ $menuOpen }) =>
        $menuOpen ? "var(--ham-after-active)" : "var(--ham-after)"};
    }
  }
`;

const StyledSidebar = styled.aside<{ $menuOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    ${({ theme }) => theme.mixins.flexCenter};
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    padding: 50px 10px;
    width: min(75vw, 400px);
    height: 100vh;
    outline: 0;
    background-color: var(--light-navy);
    box-shadow: -10px 0px 30px -15px var(--navy-shadow);
    z-index: 9;
    transform: translateX(${(props) => (props.$menuOpen ? 0 : 100)}vw);
    visibility: ${(props) => (props.$menuOpen ? "visible" : "hidden")};
    transition: var(--transition);
  }

  nav {
    ${({ theme }) => theme.mixins.flexBetween};
    width: 100%;
    flex-direction: column;
    color: var(--lightest-slate);
    font-family: var(--font-mono);
    text-align: center;
  }

  ol {
    padding: 0;
    margin: 0;
    list-style: none;
    width: 100%;

    li {
      position: relative;
      margin: 0 auto 20px;
      counter-increment: item 1;
      font-size: clamp(var(--fz-sm), 4vw, var(--fz-lg));

      @media (max-width: 600px) {
        margin: 0 auto 10px;
      }

      &:before {
        content: "0" counter(item) ".";
        display: block;
        margin-bottom: 5px;
        color: var(--green);
        font-size: var(--fz-sm);
      }
    }

    a {
      ${({ theme }) => theme.mixins.link};
      width: 100%;
      padding: 3px 20px 20px;
    }
  }

  .resume-link {
    ${({ theme }) => theme.mixins.bigButton};
    padding: 18px 50px;
    margin: 10% auto 0;
    width: max-content;
  }
`;

function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setMenuOpen((pre) => !pre), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(wrapperRef, closeMenu);

  useEffect(() => {
    const onResize = (e: UIEvent) => {
      const target = e.currentTarget as Window;
      if (target.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case KEY_CODES.ESCAPE:
          setMenuOpen(false);
          break;

        default:
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <StyledMenu>
      <div ref={wrapperRef}>
        <StyledHamburgerButton
          onClick={toggleMenu}
          $menuOpen={menuOpen}
          aria-label="Menu"
        >
          <div className="ham-box">
            <div className="ham-box-inner" />
          </div>
        </StyledHamburgerButton>

        <StyledSidebar
          $menuOpen={menuOpen}
          aria-hidden={!menuOpen}
          tabIndex={menuOpen ? 1 : -1}
        >
          <nav>
            {navLinks && (
              <ol>
                {navLinks.map(({ url, name }, i) => (
                  <li key={i}>
                    <Link href={url} onClick={() => setMenuOpen(false)}>
                      {name}
                    </Link>
                  </li>
                ))}
              </ol>
            )}

            <a href="/resume.pdf" className="resume-link">
              Resume
            </a>
          </nav>
        </StyledSidebar>
      </div>
    </StyledMenu>
  );
}

export default Menu;
