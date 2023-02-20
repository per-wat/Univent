
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
  background: #FFFFFF;
  height: 80px;
  display: flex;
  justify-content: space-between;
  padding: 20px;
 
`;

export const NavLink = styled(Link)`
  color: #000000;
  text-decoration: none;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  &.active {
    color: #00008B;
  }
`;


export const NavMenu = styled.div`
  display: flex;
  align-items: center;

`;

