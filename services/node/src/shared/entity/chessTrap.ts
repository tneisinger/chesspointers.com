import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ChessTree } from '../chessTypes';

@Entity({ name: 'chessTraps' })
export class ChessTrap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'bool',
    nullable: false,
  })
  playedByWhite: boolean;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
  })
  chessTree: ChessTree

  @CreateDateColumn()
  addedOn: Date;
}

