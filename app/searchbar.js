"use client"
import style from './searchbar.module.css'

import { useForm } from 'react-hook-form'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import Suggestion from './suggestion'

import reactStringReplace from 'react-string-replace';

function getSuggestionComponent({suggestionList, choiceNum, setChoiceNum}){
    let localSuggestionList = [];
    
    for(let i = 0; i<suggestionList?.length; i++){
        localSuggestionList.push(<Suggestion index={i} choiceNum={choiceNum} setChoiceNum={setChoiceNum} url={suggestionList[i].url} thumbnail={suggestionList[i].thumbnail} title={suggestionList[i].title} />);
    }

    return localSuggestionList;
}

export default function Searchbar({isFocus, setFocus}){
    const data = [
        { title: "또롱맨 파이팅", url: "/opening.png", thumbnail: "/opening.png" },
        { title: "해적왕 또롱맨", url: "/openingZero.png", thumbnail:"/openingZero.png"}        
    ]

    const {
        register,
        handleSubmit
    } = useForm();

    const [suggestionList, setSuggestionList] = useState();

    const [suggestionComponent, setSuggestionComponent] = useState();

    const [choiceNum, setChoiceNum] = useState(-1);

    const router = useRouter();

    const onFocus = () => {
        setSuggestionList(data);
        setSuggestionComponent(getSuggestionComponent({ suggestionList: data, choiceNum: choiceNum, setChoiceNum:setChoiceNum }));
        setFocus(true);
    }

    const onKeyDown = (e) => {
        if (e.keyCode == '38') {//up
            if (choiceNum != -1) {

                setChoiceNum(choiceNum - 1);
            }

        } else if (e.keyCode == '40') {//Down
            if (choiceNum != suggestionList.length-1) {
                setChoiceNum(choiceNum + 1);

            }
        } else if (e.keyCode != '13'){//And without Enter
            setChoiceNum(-1);

        }
    }

    const onKeyUp = (e) => {
        if (e.keyCode != '38' && e.keyCode != '40'){ //If key is not up or down then set a suggestionList
            let tmptData = []
            data.forEach((el) => {
                if (el.title.match(e.target.value)?.length > 0) {
                    tmptData.push(el);
                    if (e.target.value != "" && e.target.value != " "){
                        tmptData[tmptData.length - 1].title = 
                        reactStringReplace(tmptData[tmptData.length-1].title, e.target.value, (match, i)=>(<span className={style.suggestionbar__span__strong}>{match}</span>))

                    }
                }
            })
            setSuggestionList(tmptData);
            setSuggestionComponent(getSuggestionComponent({ suggestionList: tmptData, choiceNum: choiceNum, setChoiceNum: setChoiceNum }));

        }else{
            setSuggestionComponent(getSuggestionComponent({ suggestionList: suggestionList, choiceNum: choiceNum, setChoiceNum: setChoiceNum }));

        }

    }

    const onSubmit = () => {
        if (choiceNum != -1) {
            router.push(suggestionList[choiceNum].url);

        }

    }

    return(
        <>
            
            <form 
                className={isFocus?style.searchbar_container__focus:style.searchbar_container}
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                onFocus={onFocus}
                onMouseMove={() => {setSuggestionComponent(getSuggestionComponent({ suggestionList: suggestionList, choiceNum: choiceNum, setChoiceNum: setChoiceNum })); }}
                onClick={(e)=>{e.stopPropagation()}}
                >
                <input
                    className={style.searchbar__input}
                    {
                        ...register("typing",{required:false})
                    }
                />
                <img className={style.searchbar__img} src="magnifyGlass.png"/>
                <div
                    className={isFocus ?style.suggestionbar_container:style.suggestionbar_container__none}
                >
                    {suggestionComponent}
                </div>
                <div className={style.searchbar__black_line} />
            </form>
        </>
    )
}