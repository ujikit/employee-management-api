export class JwtDto {
  user: {
    id: number;
    [key: string]: number | string | Date;
  };
}
