import { cn, copyToClipboard } from "@/lib/utils";

///////////////////////////////////////////////////////////////////////////////
// region_start: cn
///////////////////////////////////////////////////////////////////////////////

describe("cn utility function", () => {
  test("returns empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });

  test("returns a single class name when called with a string argument", () => {
    expect(cn("btn")).toBe("btn");
  });

  test("combines multiple class names when called with multiple string arguments", () => {
    expect(cn("btn", "btn-primary", "lg")).toBe("btn btn-primary lg");
  });

  test("ignores falsy values when called with a mix of truthy and falsy arguments", () => {
    expect(cn("btn", null, undefined, "btn-primary", "", 0, "lg", false)).toBe(
      "btn btn-primary lg"
    );
  });

  test("returns class names based on boolean values when called with an object argument", () => {
    const props = { btn: true, "btn-primary": false, lg: true };
    expect(cn(props)).toBe("btn lg");
  });

  test("combines multiple input types correctly", () => {
    expect(cn("btn", { "btn-primary": true, lg: false }, "lg")).toBe(
      "btn btn-primary lg"
    );
  });
});

///////////////////////////////////////////////////////////////////////////////
// region_end: cn
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// region_start: copyToClipboard
///////////////////////////////////////////////////////////////////////////////

describe("copyToClipboard", () => {
  const mockWriteText = jest.fn();

  beforeAll(() => {
    // Mock the clipboard API
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
    });
  });

  afterAll(() => {
    // Restore the original clipboard API
    Object.defineProperty(navigator, "clipboard", {
      value: global.navigator.clipboard,
      writable: true,
    });
  });

  describe("with successful writeText", () => {
    beforeEach(() => {
      mockWriteText.mockImplementation(() => Promise.resolve());
    });

    test("copies text to clipboard using Clipboard API", () => {
      const text = "Hello, world!";
      const onSuccess = jest.fn();
      const onError = jest.fn();

      copyToClipboard({ text, onSuccess, onError });

      expect(mockWriteText).toHaveBeenCalledWith(text);
      // mockWriteText function that is called in the implementation of copyToClipboard
      // is returning a promise that resolves immediately,
      // before the onSuccess callback has a chance to be called.
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    test("copies text to clipboard using Clipboard API async", async () => {
      const text = "Hello, world!";
      const onSuccess = jest.fn();
      const onError = jest.fn();

      const promise = copyToClipboard({ text, onSuccess, onError });

      expect(mockWriteText).toHaveBeenCalledWith(text);

      await promise;

      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    test("calls onSuccess if clipboard writeText succeeds", async () => {
      const text = "Hello, world!";
      const onSuccess = jest.fn();
      const onError = jest.fn();

      copyToClipboard({ text, onSuccess, onError });

      await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for the promise to resolve/reject

      expect(mockWriteText).toHaveBeenCalledWith(text);
      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe("with failed writeText", () => {
    beforeEach(() => {
      const error = new Error("Failed to write text to clipboard");
      mockWriteText.mockImplementation(() => Promise.reject(error));
    });

    test("calls onError if clipboard writeText fails", async () => {
      const text = "Hello, world!";
      const onSuccess = jest.fn();
      const onError = jest.fn();

      copyToClipboard({ text, onSuccess, onError });

      await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for the promise to resolve/reject

      expect(mockWriteText).toHaveBeenCalledWith(text);
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
    });

    test("calls onError if clipboard writeText fails async", async () => {
      const text = "Hello, world!";
      const onSuccess = jest.fn();
      const onError = jest.fn();

      try {
        await copyToClipboard({ text, onSuccess, onError });
      } catch (err) {
        expect(mockWriteText).toHaveBeenCalledWith(text);
        expect(onSuccess).not.toHaveBeenCalled();
        expect(onError).toHaveBeenCalled();
      }
    });
  });
});

///////////////////////////////////////////////////////////////////////////////
// region_end: copyToClipboard
///////////////////////////////////////////////////////////////////////////////

// /**
//  * `fetcher` fetches data from the given URL and returns it as JSON.
//  *
//  * @param options - An object containing the URL to fetch.
//  * @returns A promise that resolves to the fetched JSON data.
//  * @throws If the fetch request fails or the response is not valid JSON.
//  */
// export async function fetcher<T>(options: {
//   url: RequestInfo | URL;
//   // }): Promise<T | Error> {
// }): Promise<T> {
//   try {
//     const response = await fetch(options.url);
//     if (!response.ok) {
//       throw new Error(`HTTP error: ${response.status}`);
//     }
//
//     const json = (await response.json()) as T;
//     return json;
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new Error(
//         `Failed to fetch data from ${options.url}: ${error.message}`
//       );
//     }
//     throw new Error(
//       `Unexpected error while fetching data from ${options.url}: ${String(
//         error
//       )}`
//     );
//   }
// }
//
