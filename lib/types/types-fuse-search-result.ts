import Fuse from "fuse.js";
import { ICountry } from "./types-country";

export interface SearchResult extends Fuse.FuseResult<ICountry> {};
