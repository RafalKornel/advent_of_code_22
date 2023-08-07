import { Signal, Result } from "./types.ts";

export function compare(a: Signal, b: Signal): Result {
  for(let i = 0;i < a.length;i++) {
    let left = a[i];
    let right = b[i];

    if(right === undefined) break;

    if(typeof left === "number" && typeof right === "number") {
      if(left < right) return Result.InOrder;
      else if(left > right) return Result.NotInOrder;
      else {
        continue;
      }
    }

    // both values are arrays or one of values is number
    left = left instanceof Array ? left : [left];
    right = right instanceof Array ? right : [right];

    const result = compare(left, right);

    if(result !== Result.Unknown) return result;
  }

  if(a.length < b.length) return Result.InOrder;

  if(a.length > b.length) return Result.NotInOrder;

  return Result.Unknown;
}
