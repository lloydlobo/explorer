import React from "react";
import { Button } from "@/components/ui/button";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Button", () => {
  test("loads and displays greeting", () => {
    // ARRANGE
    const handleStartGame = jest.fn();
    render(
      <Button data-testid="startGameTrigger" onClick={handleStartGame}>
        Start Game
      </Button>
    );

    // ACT
    fireEvent.click(screen.getByText("Start Game"));

    // ASSERT
    expect(handleStartGame).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  test("updates innerHTML on click", () => {
    // ARRANGE
    document.body.innerHTML = `
      <div id="myDiv">Initial Content</div>
      <Button data-testid="updateButton">Update Content</Button>
    `;

    // ACT
    fireEvent.click(screen.getByTestId("updateButton"));

    // ASSERT
    expect(document.getElementById("myDiv")).toHaveTextContent(
      "Initial Content"
    );
  });
});

// describe("Button", () => {
//   test("loads and displays greeting", async () => {
//     // ARRANGE
//     //   document.body.innerHTML = `
//     //   <span data-testid="not-empty"><span data-testid="empty"></span></span>
//     //   <Button data-testid="startGameTrigger">Start Game</Button>
//     //   <div data-testid="visible">Visible Example</div>
//     // `;
//     render(<Button data-testid="startGameTrigger">Start Game</Button>);
//
//     const handleStartGame = jest.fn();
//     const button = screen.getByTestId("startGameTrigger");
//     button.onclick = handleStartGame;
//
//     // ACT
//     fireEvent.click(button);
//
//     // ASSERT
//     expect(handleStartGame).toHaveBeenCalledTimes(1);
//     expect(button).not.toBeDisabled();
//   });
// });

// describe("Button", () => {
//   test("loads and displays greeting", async () => {
//     // ARRANGE
//     document.body.innerHTML = `
//     <span data-testid="not-empty"><span data-testid="empty"></span></span>
//     <Button data-testid="startGameTrigger">Start Game</Button>
//     <div data-testid="visible">Visible Example</div>
//   `;
//
//     // render( <Button /> );
//     // ACT
//     // await userEvent.click(screen.getByText("Load Greeting"));
//     // await screen.findByRole("heading");
//     const button = await screen.getByRole("button");
//
//     // fireEvent.click(screen.getByText("Start Game"));
//     fireEvent.click(button);
//     // userEvent.click(button);
//
//     const handleFillEmpty = jest.fn(
//       () =>
//         ((
//           document.querySelector('[data-testid="not-empty"]') as HTMLElement
//         ).innerHTML = "hello there")
//     );
//
//     // userEvent.click(button);
//     const handleClick = jest.fn(() => {
//       return document.querySelector(
//         '[data-testid="startGameTrigger"]'
//       ) as HTMLButtonElement;
//     });
//     fireEvent.click(screen.getByText("Start Game"));
//
//     handleClick();
//     expect(handleClick).toHaveBeenCalledTimes(1);
//
//     // const handleClickButton = jest.fn(
//     //   () =>
//     //     document.querySelector(
//     //       '[data-test-id="startGameTrigger"]'
//     //     ) as HTMLElement
//     // );
//     // userEvent.click(button);
//     // expect(handleClickButton).toHaveBeenCalledTimes(1);
//     // (document.querySelector('[data-testid="empty"]') as HTMLElement).innerHTML = ""
//
//     // expect(button).toHaveBeenCalledTimes(1);
//
//     // ASSERT
//     // expect(screen.getByRole("heading")).toHaveTextContent("hello there");
//     expect(screen.getByRole("button")).not.toBeDisabled();
//   });
// });
//
// // const handleClick = jest.fn();
// // render(<Button onClick={handleClick}>Start Game</Button>);
// //
// // // ACT
// // const button = screen.getByRole("button");
// // useEvent.click(button);
// //
// // // ASSERT
// // expect(handleClick).toHaveBeenCalledTimes(1);
//
