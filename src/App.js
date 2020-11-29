import "./App.css";
import { firestore } from "./firebase";
import { useEffect, useCallback, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import axios from "axios";

class TurnEndError extends Error {
  constructor(turn, ...params) {
    super(...params);
    this.turn = turn;
  }
}

function App() {
  const [lastTurn, setLastTurn] = useState(0);
  const fetchData = useCallback(async () => {
    try {
      const docs = await firestore.collection("lottoNumbers").get();
      //console.log(docs.size);
      setLastTurn(docs.size);
      docs.forEach((doc) => {
        console.log(doc.data());
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    //console.log(axios);
    fetchData();
  }, [fetchData]);

  const getNumbers = async (drwNo) => {
    const url = `/common.do?method=getLottoNumber&drwNo=${drwNo}`;
    const result = await axios.get(url);
    console.log(result.data);
    if (result.data.returnValue === "fail") {
      throw Error("not found");
    }

    return numbersFromResult(result.data);
  };

  const numbersFromResult = (data) => {
    //console.log(data);
    const {
      drwtNo1,
      drwtNo2,
      drwtNo3,
      drwtNo4,
      drwtNo5,
      drwtNo6,
      bnusNo,
    } = data;
    const choosed = { drwtNo1, drwtNo2, drwtNo3, drwtNo4, drwtNo5, drwtNo6 };
    //console.log(choosed);
    return { numbers: Object.values(choosed), bonus: bnusNo };
  };

  const transferFromSiteToDb = async (turn) => {
    for (let i = turn; i < turn + 4; turn++) {
      try {
        const result = await getNumbers(turn);
        await firestore.collection("lottoNumbers").doc(`turn-${turn}`).set({
          numbers: result.numbers,
          bonus: result.bonus,
        });
        //console.log(result.numbers);
        turn++;
      } catch (err) {
        console.log(err, "maybe to end");
        throw TurnEndError(turn);
      }
    }
    return turn;
  };
  const loadToLatest = async () => {
    //console.log("before getNumbers");
    const loadTimer = setInterval(async () => {
      try {
        const updated = await transferFromSiteToDb(lastTurn + 1);
        setLastTurn(updated);
      } catch (err) {
        clearInterval(loadTimer);
        console.log(err);
      }
    }, 1000);
  };

  const deleteAll = async () => {
    const docs = await firestore.collection("lottoNumbers").get();
    console.log(docs);
    docs.forEach((doc) => {
      console.log(doc.ref);

      doc.ref.delete();
    });
  };
  return (
    <div className="App">
      <section>
        <Typography>최근 회수: {lastTurn}</Typography>
        <Button onClick={loadToLatest} variant="contained" color="primary">
          최신으로 로드
        </Button>
        <Button onClick={deleteAll} variant="contained" color="secondary">
          모두 지우기
        </Button>
      </section>
    </div>
  );
}

export default App;
