import React from "react";
import { PurpleH4B70 } from "../../styles/buttons/purple_H4B70_style";
import SearchIcon from "../icons/Search-Icon.svg";

interface PurpleButtonH4B70Props {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const PurpleButtonH4B70: React.FC<PurpleButtonH4B70Props> = ({ onClick }) => {
    return (
        <PurpleH4B70 onClick={onClick} type="submit">
            <img src={SearchIcon} alt="Search" />
        </PurpleH4B70>
    );
};