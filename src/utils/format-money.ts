export default function formatMoney(money: number | undefined): string {
  if (!money) {
    return '0đ';
  }
  return `${money.toLocaleString()}đ`;
}
