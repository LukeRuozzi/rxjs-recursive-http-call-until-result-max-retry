import { Observable, of, EMPTY } from 'rxjs';
import { tap, filter, take, delay, retry, map, switchMap, expand } from 'rxjs/operators';
import moment from 'moment';

let innerObsCnt = 0;

const delayTime = 250;

function getOcrCall(): Observable {
  const value = Math.random();
  return of({ data: value, msg: value > 0.8 ? 'SUCCESS' : 'PENDING' }).pipe(
    delay(delayTime),
    tap(() => console.log(`#${++innerObsCnt} ocr call`)), // solo per logging
    tap(data => printLog(data)), // solo per logging
  );
}

getOcrCall()
  .pipe(
    expand(res => res.msg === 'PENDING' && innerObsCnt < 5 ? getOcrCall() : res),
    filter(res => res.msg === 'SUCCESS'), // filtro solo le chiamate che hanno avuto esito positivo
    take(1)
  )
  .subscribe(
    res => console.log('res: ', res),
    err => console.log('Error: ', err)
  );

function printLog(data) {
  console.log(
    `#${innerObsCnt} ${moment().format('HH:mm:ss:SSS')}  --> `,
    data.msg
  );
}
