import React from "react";
import "./App.css";
import yoga from "yoga-layout";
import jsPDF from "jspdf";
import daisyThemes from "./daisyThemes";
import { DEFAULT_PDF_OPTIONS } from "./DEFAULT_PDF_OPTIONS";
import { getElementProps, drawElement } from "./getElementProps";

function App(): React.ReactElement {
  console.log("themes", daisyThemes);
  const pdfDoc = new jsPDF(DEFAULT_PDF_OPTIONS);
  const root_width = pdfDoc.internal.pageSize.width;
  const root_height = pdfDoc.internal.pageSize.height;

  const A4_PROPS: React.CSSProperties = {
    width: Math.ceil(root_width),
    height: Math.ceil(root_height),
    background: "white",
    flex: 1,
  };

  pdfDoc.setFontSize(12);
  pdfDoc.setFont("helvetica");
  pdfDoc.setTextColor(0, 0, 0);
  pdfDoc.setFillColor(255, 255, 255);
  pdfDoc.rect(0, 0, root_width, root_height, "F");

  const onGenerate = () => {
    const htmlDoc = document.getElementById("pdf");

    if (htmlDoc) {
      console.log("root", { root_width, root_height });

      const elements = getElementProps(htmlDoc);
      console.log("elements", elements);
      const root = elements.node;
      root.calculateLayout(root_width, root_height, yoga.DIRECTION_LTR);

      drawElement(elements, pdfDoc);

      window.open(pdfDoc.output("bloburl"), "_blank");
    }
  };

  return (
    <>
      <button
        onClick={onGenerate}
        className="btn btn-primary z-50 absolute top-2 right-2"
      >
        Generate
      </button>
      <div className="absolute inset-0 flex flex-col">
        <div className="overflow-auto items-center w-full">
          <div id="pdf" style={A4_PROPS}>
            <div className="flex flex-col h-full text-slate-300">
              <div className="flex flex-col items-center justify-center w-full bg-slate-600 p-4">
                <div className="py-1 text-2xl">Jens Peder Meldgaard</div>
                <div className="flex text-slate-400 flex-row items-center justify-center text-xs">
                  Copenhagen, Denmark - +45 60 46 91 06 - jenspederm@gmail.com
                </div>
              </div>
              <div className="flex flex-col justify-center items-center grow p-2">
                <div className="bg-slate-100 text-slate-600 px-2 text-xs">
                  Element 1
                </div>
                <div className="bg-slate-200 text-slate-600 px-2 text-sm">
                  Element 2
                </div>
                <div className="bg-slate-300 text-slate-600 px-2 text-base">
                  Element 3
                </div>
                <div className="bg-slate-400 text-slate-200 px-2 text-lg">
                  Element 4
                </div>
                <div className="bg-slate-500 text-slate-200 rounded-md px-2 text-xl">
                  Element 5
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
