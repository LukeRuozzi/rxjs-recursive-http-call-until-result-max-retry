import { Observable, of } from 'rxjs';
import { tap, filter, take, expand, delay } from 'rxjs/operators';
import moment from 'moment';

interface Data {
  data: number;
  msg: string;
}

let attemptsCnt = 1;
const maxAttempts = 5;
const delayTime = 250;

function getOcrCall(): Observable<Data> {
  const value = Math.random();
  return of<Data>({
    data: value,
    msg: value > 0.8 ? 'SUCCESS' : 'PENDING'
  }).pipe(
    delay(attemptsCnt === 1 ? 0 : delayTime), // ritarda le chiamate successive alla prima
    tap(data => printLog(data)) // solo per logging
  );
}

getOcrCall()
  .pipe(
    expand((res: Data) => {
      if (attemptsCnt++ === maxAttempts) {
        console.log(`no results after ${attemptsCnt - 1} attempts`);
      } else {
        console.log(`recursive call #${attemptsCnt}`)
      }
      return res.msg === 'PENDING' ? getOcrCall() : of(res);
    }),
    take(maxAttempts),
    filter((res: Data) => res.msg === 'SUCCESS'), // filtro solo le chiamate che hanno avuto esito positivo
    take(1)
  )
  .subscribe(
    res => console.log('res: ', res),
    err => console.log('Error: ', err)
  );

function printLog(data) {
  console.log(
    `#${attemptsCnt} ${moment().format('HH:mm:ss:SSS')} OCR Call  --> `,
    data.msg
  );
}
