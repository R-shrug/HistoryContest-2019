import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, UpdateDateColumn} from "typeorm";
@Entity()
export class Student extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
    length:20
    })
    name: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({default:0})
    identity:string;//0:学生；1：管理员；2：辅导员

    @Column({default:"none"})//院系序号，例：“71”，“09”
    department:string;

    @Column({default:-1})//得分，-1为未答题
    score:number;

    @Column({default:-1})//用时，单位为s!!!!!!
    time_use:number;

    @Column({default:null})//开始时间，格式为Date!!!!!!!
    time_start:Date;

    @Column({type:"simple-array",default:null})
    choice_question:number[];

    @Column({type:"simple-array",default:null})
    judgment_question:number[];

    @Column({type:"simple-array",default:null})//选择题答题
    answers_choice:number[];

    @Column({type:"simple-array",default:null})//判断题答题
    answers_judgment:number[];

    @Column({type:"simple-array",default:null})
    answers:number[];

    @UpdateDateColumn()
    updateDate:Date;
}
