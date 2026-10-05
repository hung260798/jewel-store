type JsonSafe<T> = {
  [K in keyof T]: T[K] extends Function | symbol
    ? never
    : T[K] extends undefined
      ? null
      : T[K] extends (infer U)[]
        ? JsonSafe<U>[]
        : T[K] extends object
          ? JsonSafe<T[K]>
          : T[K];
};

/**
 * Biến đổi một đối tượng thành dạng an toàn để truyền đi dưới dạng JSON.
 * - Thay thế tất cả các giá trị 'undefined' bằng 'null'.
 * - Loại bỏ các thuộc tính có giá trị là 'function' hoặc 'symbol'.
 * - Xử lý đệ quy các đối tượng và mảng lồng nhau.
 *
 * @param input Đối tượng đầu vào cần biến đổi.
 * @returns Một đối tượng mới, an toàn để truyền dưới dạng JSON.
 */
export function toSafeJson<T extends object>(input: T): JsonSafe<T> {
  if (input === null || typeof input !== "object") {
    // Trường hợp cơ sở: null hoặc kiểu dữ liệu nguyên thủy (không phải object/array)
    // Đối với `undefined` ở cấp độ gốc, chúng ta không thể thay đổi nó thành `null`
    // vì chúng ta cần một đối tượng để trả về.
    return input as JsonSafe<T>;
  }

  // Xử lý Mảng
  if (Array.isArray(input)) {
    return input.map((item) => toSafeJson(item)) as JsonSafe<T>;
  }

  // Xử lý Đối tượng
  const safeObject: any = {};

  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      const value = input[key];
      const type = typeof value;

      if (type === "function" || type === "symbol") {
        // Bỏ qua các thuộc tính là hàm hoặc symbol
        continue;
      }

      if (value === undefined) {
        // Thay thế 'undefined' bằng 'null'
        safeObject[key] = null;
      } else if (type === "object" && value !== null) {
        // Xử lý đệ quy cho các đối tượng và mảng lồng nhau
        safeObject[key] = toSafeJson(value);
      } else {
        // Giữ nguyên các giá trị khác (string, number, boolean, null)
        safeObject[key] = value;
      }
    }
  }

  return safeObject as JsonSafe<T>;
}
