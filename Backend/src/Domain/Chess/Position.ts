export  class Position{
  constructor(
        public readonly row:number,
        public readonly column:number,
  ){}

  isValid(){
    return (this.row>=0 && this.row<8 )&& (this.column>=0 && this.column<8);
  }

  equals(other:Position):boolean{
    return this.row === other.row && this.column === other.column;
  }

  offset(r:number,c:number):Position{
    return new Position(this.row+r,this.column+c);
  }

  toString():string{
    return `(${this.row},${this.column})`;
  }

}
