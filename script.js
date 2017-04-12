moment.locale('ru');

const constData = {
                daysWeek: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
                months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                years: getArray (2000, 2020),
                classCurrent: 'current',
                classPrevAndNext: 'prevAndNext'
                };

function getArray(first, last){
    let array = [];
    if (first < last){
        for (let i = first; i <= last; i++){
            array.push(i);
        }
        return array;
    } else if (first > last){
        for (let i = first; i > last; i--){
            array.push(i);
        }
        return array.reverse();
    }
    return [];
}

class Option extends React.Component{
    render() {
        return (<option>{this.props.title}</option>)
    }
}

class Select extends React.Component{
    render(){
        return (
            <select onChange={this.props.func} id={this.props.id} value={this.props.select}>
                {
                    this.props.title.map((elem, ind) => {
                        return <Option title={elem} key={ind} />
                    })
                }
            </select>
        )
    }
}

class Cell extends React.Component{
    render(){
        return <div className="cell">
            <span className={this.props.class}><span className="text">{this.props.title}</span></span>
        </div>
    }
}

class CalendarTable extends React.Component {
    render(){
         return (
            <div className="calendar">
                {
                    this.props.daysWeek.map((elem, ind) => {
                        return <Cell key={ind} title={elem}/>
                    })
                }
                {

                    this.props.DaysPrevMonth.map((elem, ind) => {
                        console.log(this.props.classPrevAndNext);
                        return <Cell key={ind} title={elem} class={this.props.PrevAndNext} />
                    })
                }
                {
                    this.props.nDaysCurrentMonth.map((elem, ind) => {
                        return <Cell key={ind} title={elem} class={this.props.current}/>
                    })
                }
                {
                    this.props.nDaysNextMonth.map((elem, ind) => {
                        return <Cell key={ind} title={elem} class={this.props.PrevAndNext}/>
                    })
                }
            </div>
        )
    }
}

class Calendar extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            date: moment(),
            day: 'пн',
            nDay: 0
        };

        this.change = this.change.bind(this);
    }

    change(){
        this.setState({
                date: getNewDate(),
                day: document.getElementById('days').value,
                nDay: document.getElementById('days').selectedIndex + 1,
            });

        function getNewDate(){

            let year = document.getElementById('years').value;
            let month = document.getElementById('months').selectedIndex;

            return moment().set({
                date: moment().date(),
                month: month,
                year: year
            });
        }
    }

    render(){

        let date = this.state.date;
        let day = this.state.day;
        let nDay = this.state.nDay;
        console.log(nDay);
        let nDaysPrevMonth = date.clone().month(date.clone().month() - 1).endOf('M').get('Date');
        let PrevMonthDaysCalendar = date.clone().startOf('M').get('days') - 1;
        let numberFirstDayCalendar = nDaysPrevMonth - PrevMonthDaysCalendar;
        let CurrentMonthDaysCalendar = date.clone().endOf('M').diff(date.clone().startOf('M'), 'd') + 1;

        let nDaysCurrentMonth = getArray(1, CurrentMonthDaysCalendar, day);
        let DaysPrevMonth = getArray(nDaysPrevMonth, numberFirstDayCalendar, day);
        let nDaysNextMonth = getArray(1, 42 - PrevMonthDaysCalendar - CurrentMonthDaysCalendar,day);
        let n = nDaysNextMonth.length + 1;
        let transfArray = this.props.constData.daysWeek.slice(0, this.props.constData.daysWeek.length);
        switch (day){
            case 'пн':
                this.props.constData.daysWeek = transfArray;
                break;
            case 'вт':
                transformArray(1, transfArray.slice(0, transfArray.length));
                DaysPrevMonth.splice(0,1);
                nDaysNextMonth.push(n);
                break;
            case 'ср':
                transformArray(2, transfArray.slice(0, transfArray.length));
                DaysPrevMonth.splice(0,2);
                nDaysNextMonth.push(n, n+1);
                break;
            case 'чт':
                transformArray(3, transfArray.slice(0, transfArray.length));
                DaysPrevMonth.splice(0,3);
                nDaysNextMonth.push(n, n+1, n+2);
                break;
            case 'пт':
                transformArray(4, transfArray.slice(0, transfArray.length));
                DaysPrevMonth.splice(0,4);
                nDaysNextMonth.push(n, n+1, n+2, n+3);
                break;
            case 'сб':
                transformArray(5, transfArray.slice(0, transfArray.length));
                DaysPrevMonth.splice(0,5);
                nDaysNextMonth.push(n, n+1, n+2, n+3, n+4);
                break;
            case 'вс':
                transformArray(6, transfArray.slice(0, transfArray.length));
                DaysPrevMonth.splice(0,6);
                nDaysNextMonth.push(n, n+1, n+2, n+3, n+4, n+5);
                break;
        }


        function transformArray(n, array){
            let delElem = array.splice(0, n);
            array.push(delElem);
            return array;
        }

        setTimeout(function selectToday(){
            let days = document.getElementsByClassName('current');
            for (let i = 0; i < days.length; i++) {
                if (+days[i].innerText == moment().get('Date')){
                    days[i].parentNode.style.backgroundColor = '#C3B72F';
                    days[i].className = 'today';
                }
            }
       }, 0);


        return (
            <div className="Wrap">
                <Select title={this.props.constData.years} func={this.change} id="years" select={date.get('year')}/>
                <Select title={this.props.constData.months} func={this.change} id="months" select={this.props.constData.months[date.get('M')]}/>
                <Select title={this.props.constData.daysWeek} func={this.change} id="days"/>
                <CalendarTable nDaysCurrentMonth={nDaysCurrentMonth} DaysPrevMonth={DaysPrevMonth} nDaysNextMonth={nDaysNextMonth}
                               daysWeek={transfArray} PrevAndNext={this.props.constData.classPrevAndNext}
                               current={this.props.constData.classCurrent} />
            </div>
        )
    }
}

ReactDOM.render(

<Calendar constData={constData} />,
  document.getElementById('calendar')
);
