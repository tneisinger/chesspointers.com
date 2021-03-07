import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ChessTree } from '../chessTypes';

@Entity({ name: 'chess_openings' })
export class Opening {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'full_name',
    length: 50,
    unique: true,
    nullable: false,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    name: 'short_name',
    length: 30,
    unique: true,
    nullable: false,
  })
  shortName: string;

  @Column({
    type: 'jsonb',
    name: 'chess_tree',
    array: false,
    nullable: false,
  })
  chessTree: ChessTree;

  @CreateDateColumn({
    name: 'added_on',
  })
  addedOn: Date;
}
