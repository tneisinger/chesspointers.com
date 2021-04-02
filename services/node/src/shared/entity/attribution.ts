import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'attributions' })
export class Attribution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  text: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  url: string;
}
