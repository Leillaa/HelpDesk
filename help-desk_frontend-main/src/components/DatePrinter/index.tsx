

const DatePrinter = ({...props} )=>{
    const {
        date, format
    } = props

    if (!date || !format) return <></>;
    let specText = `'"`;
    let specDate = `dmyhtsDMYHTS`;
    let result = '';
    let prev = '';
    let count = 0;

    let fSpec = false

    const dOfW =  ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС', ]
    const dOfWLong =  ['понедельник', 'вторник', 'среда', 'четверг','пятница', 'суббота', 'воскресенье',]
    const month =  ['январь', 'февраль', 'март', 'апрель','май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',]

    for (let ch of format) {
        if (fSpec && specText.includes(ch)) {
            fSpec = false
            continue
        }
        if (fSpec) {
            result += ch 
            continue
        }
        if (specText.includes(ch)) {
            prev = ''
            fSpec = true
            continue
        }

        if (ch == prev) {
             count ++
        } else {
            switch(prev) {
                case 'd': {
                    let d:number = date.getDate()
                    if (count == 1) result += d;
                    else if (count == 2) result += (d < 10) ? '0' + d : d
                    else if (count == 3) result += (d > 0 && d <= 7) ? dOfW[d-1] : ''
                    else if (count >= 4) result += (d > 0 && d <= 7) ? dOfWLong[d-1] : ''
                    break
                }
                case 'D': {
                    let d:number = date.getDate()
                    if (count == 1) result += d;
                    else if (count == 2) result += (d < 10) ? '0' + d : d
                    else if (count == 3) result += (d > 0 && d <= 7) ? dOfW[d-1] : ''
                    else if (count >= 4) result += (d > 0 && d <= 7) ? dOfWLong[d-1] : ''
                    break
                }
                case 'm': {
                    let m:number = date.getMonth() + 1
                    if (count == 1) result += m;
                    else if (count == 2) result += (m < 10) ? '0' + m : m
                    else if (count >= 3) result += (m > 0 && m <= 12) ? month[m] : ''
                    break
                }
                case 'M': {
                    let m:number = date.getMonth() + 1
                    if (count == 1) result += m;
                    else if (count == 2) result += (m < 10) ? '0' + m : m
                    else if (count >= 3) result += (m > 0 && m <= 12) ? month[m] : ''
                    break
                }
                case 'y': {
                    let y:number = date.getFullYear()
                    if (count == 2) result += y % 2000
                    else if (count >= 3) result += y
                    break
                }
                case 'Y': {
                    let y:number = date.getFullYear()
                    if (count == 2) result += y % 2000
                    else if (count >= 3) result += y
                    break
                }
                case 'h': {
                    let h:number = date.getHours()
                    if (count == 1) result += h;
                    else if (count == 2) result += (h < 10) ? '0' + h : h
                    break
                }
                case 'H': {
                    let h:number = date.getHours()
                    if (count == 1) result += h;
                    else if (count == 2) result += (h < 10) ? '0' + h : h
                    break
                }
                case 't': {
                    let t:number = date.getMinutes()
                    if (count == 1) result += t;
                    else if (count == 2) result += (t < 10) ? '0' + t : t
                    break
                }
                case 'T': {
                    let t:number = date.getMinutes()
                    if (count == 1) result += t;
                    else if (count == 2) result += (t < 10) ? '0' + t : t
                    break
                }
                case 's': {
                    let s:number = date.getSeconds()
                    if (count == 1) result += s;
                    else if (count == 2) result += (s < 10) ? '0' + s : s
                    break
                }
                case 'S': {
                    let s:number = date.getSeconds()
                    if (count == 1) result += s;
                    else if (count == 2) result += (s < 10) ? '0' + s : s
                    break
                }
            }
            
            if (!specDate.includes(ch)) {
                prev = ch
                result += ch
                continue
            }

            prev = ch;
            count = 1
            
        }
    }

    switch(prev) {
        case 'd': {
            let d:number = date.getDate()
            if (count == 1) result += d;
            else if (count == 2) result += (d < 10) ? '0' + d : d
            else if (count == 3) result += (d > 0 && d <= 7) ? dOfW[d-1] : ''
            else if (count >= 4) result += (d > 0 && d <= 7) ? dOfWLong[d-1] : ''
            break
        }
        case 'D': {
            let d:number = date.getDate()
            if (count == 1) result += d;
            else if (count == 2) result += (d < 10) ? '0' + d : d
            else if (count == 3) result += (d > 0 && d <= 7) ? dOfW[d-1] : ''
            else if (count >= 4) result += (d > 0 && d <= 7) ? dOfWLong[d-1] : ''
            break
        }
        case 'm': {
            let m:number = date.getMonth() + 1
            if (count == 1) result += m;
            else if (count == 2) result += (m < 10) ? '0' + m : m
            else if (count >= 3) result += (m > 0 && m <= 12) ? month[m] : ''
            break
        }
        case 'M': {
            let m:number = date.getMonth() + 1
            if (count == 1) result += m;
            else if (count == 2) result += (m < 10) ? '0' + m : m
            else if (count >= 3) result += (m > 0 && m <= 12) ? month[m] : ''
            break
        }
        case 'y': {
            let y:number = date.getFullYear()
            if (count == 2) result += y % 2000
            else if (count >= 3) result += y
            break
        }
        case 'Y': {
            let y:number = date.getFullYear()
            if (count == 2) result += y % 2000
            else if (count >= 3) result += y
            break
        }
        case 'h': {
            let h:number = date.getHours()
            if (count == 1) result += h;
            else if (count == 2) result += (h < 10) ? '0' + h : h
            break
        }
        case 'H': {
            let h:number = date.getHours()
            if (count == 1) result += h;
            else if (count == 2) result += (h < 10) ? '0' + h : h
            break
        }
        case 't': {
            let t:number = date.getMinutes()
            if (count == 1) result += t;
            else if (count == 2) result += (t < 10) ? '0' + t : t
            break
        }
        case 'T': {
            let t:number = date.getMinutes()
            if (count == 1) result += t;
            else if (count == 2) result += (t < 10) ? '0' + t : t
            break
        }
        case 's': {
            let s:number = date.getSeconds()
            if (count == 1) result += s;
            else if (count == 2) result += (s < 10) ? '0' + s : s
            break
        }
        case 'S': {
            let s:number = date.getSeconds()
            if (count == 1) result += s;
            else if (count == 2) result += (s < 10) ? '0' + s : s
            break
        }
    }
    // console.log(result)
    return (
        <span>{result}</span>
    )
}

export default DatePrinter;






// const DatePrinter = ({...props} )=>{
    // const {
    //     date, format
    // } = props
    // if (!date || !format) return '';
    // let specText = `'"`;
    // let specDate = `dmyhtsDMYHTS`;
    // let result = '';
    // let prev = '';
    // let count = 0;

    // let fSpec = false

    // const dOfW =  ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС', ]
    // const dOfWLong =  ['понедельник', 'вторник', 'среда', 'четверг','пятница', 'суббота', 'воскресенье',]
    // const month =  ['январь', 'февраль', 'март', 'апрель','май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',]

    // for (let ch of format) {
    //     if (fSpec && specText.includes(ch)) {
    //         fSpec = false
    //         continue
    //     }
    //     if (fSpec) {
    //         result += ch 
    //         continue
    //     }
    //     if (specText.includes(ch)) {
    //         prev = ''
    //         fSpec = true
    //         continue
    //     }

    //     if (ch == prev) {
    //          count ++
    //     } else {
    //         switch(prev) {
    //             case 'd': {
    //                 let d:number = date.getDate()
    //                 if (count == 1) result += d;
    //                 else if (count == 2) result += (d < 10) ? '0' + d : d
    //                 else if (count == 3) result += (d > 0 && d <= 7) ? dOfW[d-1] : ''
    //                 else if (count >= 4) result += (d > 0 && d <= 7) ? dOfWLong[d-1] : ''
    //                 break
    //             }
    //             case 'D': {
    //                 let d:number = date.getDate()
    //                 if (count == 1) result += d;
    //                 else if (count == 2) result += (d < 10) ? '0' + d : d
    //                 else if (count == 3) result += (d > 0 && d <= 7) ? dOfW[d-1] : ''
    //                 else if (count >= 4) result += (d > 0 && d <= 7) ? dOfWLong[d-1] : ''
    //                 break
    //             }
    //             case 'm': {
    //                 let m:number = date.getMonth() + 1
    //                 if (count == 1) result += m;
    //                 else if (count == 2) result += (m < 10) ? '0' + m : m
    //                 else if (count >= 3) result += (m > 0 && m <= 12) ? month[m] : ''
    //                 break
    //             }
    //             case 'M': {
    //                 let m:number = date.getMonth() + 1
    //                 if (count == 1) result += m;
    //                 else if (count == 2) result += (m < 10) ? '0' + m : m
    //                 else if (count >= 3) result += (m > 0 && m <= 12) ? month[m] : ''
    //                 break
    //             }
    //             case 'y': {
    //                 let y:number = date.getFullYear()
    //                 if (count == 2) result += y % 2000
    //                 else if (count >= 3) result += y
    //                 break
    //             }
    //             case 'Y': {
    //                 let y:number = date.getFullYear()
    //                 if (count == 2) result += y % 2000
    //                 else if (count >= 3) result += y
    //                 break
    //             }
    //             case 'h': {
    //                 let h:number = date.getHours()
    //                 if (count == 1) result += h;
    //                 else if (count == 2) result += (h < 10) ? '0' + h : h
    //                 break
    //             }
    //             case 'H': {
    //                 let h:number = date.getHours()
    //                 if (count == 1) result += h;
    //                 else if (count == 2) result += (h < 10) ? '0' + h : h
    //                 break
    //             }
    //             case 't': {
    //                 let t:number = date.getMinutes()
    //                 if (count == 1) result += t;
    //                 else if (count == 2) result += (t < 10) ? '0' + t : t
    //                 break
    //             }
    //             case 'T': {
    //                 let t:number = date.getMinutes()
    //                 if (count == 1) result += t;
    //                 else if (count == 2) result += (t < 10) ? '0' + t : t
    //                 break
    //             }
    //             case 's': {
    //                 let s:number = date.getSeconds()
    //                 if (count == 1) result += s;
    //                 else if (count == 2) result += (s < 10) ? '0' + s : s
    //                 break
    //             }
    //             case 'S': {
    //                 let s:number = date.getSeconds()
    //                 if (count == 1) result += s;
    //                 else if (count == 2) result += (s < 10) ? '0' + s : s
    //                 break
    //             }
    //         }
            
    //         if (!specDate.includes(ch)) {
    //             prev = ch
    //             result += ch
    //             continue
    //         }

    //         prev = ch;
    //         count = 1
            
    //     }
    // }

    // switch(prev) {
    //         case 'd': {
    //                 let d:number = date.getDate()
    //                 if (count == 1) result += d;
    //                 else if (count == 2) result += (d < 10) ? '0' + d : d
    //                 else if (count == 3) result += (d > 0 && d <= 7) ? dOfW[d-1] : ''
    //                 else if (count >= 4) result += (d > 0 && d <= 7) ? dOfWLong[d-1] : ''
    //                 break
    //             }
    //             case 'D': {
    //                 let d:number = date.getDate()
    //                 if (count == 1) result += d;
    //                 else if (count == 2) result += (d < 10) ? '0' + d : d
    //                 else if (count == 3) result += (d > 0 && d <= 7) ? dOfW[d-1] : ''
    //                 else if (count >= 4) result += (d > 0 && d <= 7) ? dOfWLong[d-1] : ''
    //                 break
    //             }
    //             case 'm': {
    //                 let m:number = date.getMonth() + 1
    //                 if (count == 1) result += m;
    //                 else if (count == 2) result += (m < 10) ? '0' + m : m
    //                 else if (count >= 3) result += (m > 0 && m <= 12) ? month[m] : ''
    //                 break
    //             }
    //             case 'M': {
    //                 let m:number = date.getMonth() + 1
    //                 if (count == 1) result += m;
    //                 else if (count == 2) result += (m < 10) ? '0' + m : m
    //                 else if (count >= 3) result += (m > 0 && m <= 12) ? month[m] : ''
    //                 break
    //             }
    //             case 'y': {
    //                 let y:number = date.getFullYear()
    //                 if (count == 2) result += y % 2000
    //                 else if (count >= 3) result += y
    //                 break
    //             }
    //             case 'Y': {
    //                 let y:number = date.getFullYear()
    //                 if (count == 2) result += y % 2000
    //                 else if (count >= 3) result += y
    //                 break
    //             }
    //             case 'h': {
    //                 let h:number = date.getHours()
    //                 if (count == 1) result += h;
    //                 else if (count == 2) result += (h < 10) ? '0' + h : h
    //                 break
    //             }
    //             case 'H': {
    //                 let h:number = date.getHours()
    //                 if (count == 1) result += h;
    //                 else if (count == 2) result += (h < 10) ? '0' + h : h
    //                 break
    //             }
    //             case 't': {
    //                 let t:number = date.getMinutes()
    //                 if (count == 1) result += t;
    //                 else if (count == 2) result += (t < 10) ? '0' + t : t
    //                 break
    //             }
    //             case 'T': {
    //                 let t:number = date.getMinutes()
    //                 if (count == 1) result += t;
    //                 else if (count == 2) result += (t < 10) ? '0' + t : t
    //                 break
    //             }
    //             case 's': {
    //                 let s:number = date.getSeconds()
    //                 if (count == 1) result += s;
    //                 else if (count == 2) result += (s < 10) ? '0' + s : s
    //                 break
    //             }
    //             case 'S': {
    //                 let s:number = date.getSeconds()
    //                 if (count == 1) result += s;
    //                 else if (count == 2) result += (s < 10) ? '0' + s : s
    //                 break
    //             }
    //     }
//     console.log(result)
//     return result
// }


// console.log( DatePrinter({date: new Date(), format: 'date DD.mm.yyyy Время hh:tt:ss'}))