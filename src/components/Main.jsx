import {React, useContext, useEffect, useState} from "react";
import { fetchTags } from "../http/tagsAPI";
import { fetchAllItems } from "../http/collectionItemAPI";
import { fetchOneCollection } from "../http/collectionAPI";
import {Context} from "../index";
import {observer} from 'mobx-react';
import {Container} from "react-bootstrap";
import "../styles/main.css";

const Main = observer(() => {

    const {tag} = useContext(Context);

    const [resultCollections, setResultCollections] = useState([]);

    function groupBy(arr, property) {
        return arr.reduce((acc, cur) => {
          acc[cur[property]] = [...acc[cur[property]] || [], cur];
          return acc;
        }, {});
    };

    useEffect(() => {
        fetchTags().then((data) => tag.setTags(data));
        fetchAllItems().then((data) => {
            Object.entries(groupBy(data, "collectionId")).sort(function(a,b) {return b[1].length - a[1].length}).map((item) => {
                fetchOneCollection(item[0]).then((data) => {
                    setResultCollections((state) => ([...state, data]));
                })
            })
        })
    }, [tag]);

    console.log(resultCollections)

    return (
        <Container>
                <h1 style={{textAlign: "center", marginTop: "2vw"}}>#Tags</h1>
                {tag.tags.map((item) =>
                    <p key={item.id} className="tag">{item.text}</p>
                )}
        </Container>
    );
});

export default Main;
