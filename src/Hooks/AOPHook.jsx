import { create } from 'zustand';
import axios from "axios";
import { API } from '../Data/constants';
import { read } from "../Services/RequestMethods";

const useAOPHook = create((set) => ({
    aop_objectives: [],

}));

export default useAOPHook