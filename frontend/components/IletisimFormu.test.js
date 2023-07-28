import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
  const adinputu = screen.getByLabelText("Ad*");
  const soyadinputu = screen.getByLabelText("Soyad*");
  const emailinputu = screen.getByLabelText(/email/i);
  const mesajinputu = screen.getByLabelText(/mesaj/i);

  expect(adinputu).toBeInTheDocument();
  expect(soyadinputu).toBeInTheDocument();
  expect(emailinputu).toBeInTheDocument();
  expect(mesajinputu).toBeInTheDocument();
});

const formData = {
  ad: "gulsu",
  soyad: "te",
  email: "gulsu@te.com",
  mesaj: "hola!",
};

const errorData = {
  ad: "guls",
  soyad: "",
  email: "gulsuteytey",
  mesaj: "",
};

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const formbaslik = screen.getByRole("heading", { level: 1 });

  expect(formbaslik).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const adinputu = screen.getByLabelText("Ad*");
  adinputu.focus();
  userEvent.type(adinputu, errorData.ad);
  const adinputHata = await screen.getByText(
    /Hata: ad en az 5 karakter olmalıdır./i
  );

  expect(adinputHata).toBeInTheDocument();

  const hataArr = await screen.findAllByTestId("error");
  expect(hataArr).toHaveLength(1);
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);

  userEvent.click(screen.getByText("Gönder"));

  const hataArr = await screen.findAllByTestId("error");
  expect(hataArr).toHaveLength(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const adinputu = screen.getByLabelText("Ad*");
  adinputu.focus();
  userEvent.type(adinputu, formData.ad);

  const soyadinputu = screen.getByLabelText("Soyad*");
  soyadinputu.focus();
  userEvent.type(soyadinputu, formData.soyad);

  userEvent.click(screen.getByText("Gönder"));

  const hataArr = await screen.findAllByTestId("error");
  expect(hataArr).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const adinputu = screen.getByLabelText("Ad*");
  adinputu.focus();
  userEvent.type(adinputu, formData.ad);

  const soyadinputu = screen.getByLabelText("Soyad*");
  soyadinputu.focus();
  userEvent.type(soyadinputu, formData.soyad);

  const emailinputu = screen.getByLabelText(/email/i);
  emailinputu.focus();
  userEvent.type(emailinputu, errorData.email);

  const emailinputHata = await screen.getByText(
    /Hata: email geçerli bir email adresi olmalıdır./i
  );

  expect(emailinputHata).toBeInTheDocument();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const adinputu = screen.getByLabelText("Ad*");
  adinputu.focus();
  userEvent.type(adinputu, formData.ad);

  const emailinputu = screen.getByLabelText(/email/i);
  emailinputu.focus();
  userEvent.type(emailinputu, formData.email);

  userEvent.click(screen.getByText("Gönder"));

  const soyadinputHata = await screen.getByText(/Hata: soyad gereklidir./i);

  expect(soyadinputHata).toBeInTheDocument();
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const adinputu = screen.getByLabelText("Ad*");
  adinputu.focus();
  userEvent.type(adinputu, formData.ad);

  const soyadinputu = screen.getByLabelText("Soyad*");
  soyadinputu.focus();
  userEvent.type(soyadinputu, formData.soyad);

  const emailinputu = screen.getByLabelText(/email/i);
  emailinputu.focus();
  userEvent.type(emailinputu, formData.email);

  userEvent.click(screen.getByText("Gönder"));

  const hataArr = await screen.queryAllByTestId("error");
  expect(hataArr).toHaveLength(0);
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);

  const adinputu = screen.getByLabelText("Ad*");
  adinputu.focus();
  userEvent.type(adinputu, formData.ad);

  const soyadinputu = screen.getByLabelText("Soyad*");
  soyadinputu.focus();
  userEvent.type(soyadinputu, formData.soyad);

  const emailinputu = screen.getByLabelText(/email/i);
  emailinputu.focus();
  userEvent.type(emailinputu, formData.email);

  const mesajinputu = screen.getByLabelText(/mesaj/i);
  mesajinputu.focus();
  userEvent.type(mesajinputu, formData.mesaj);
});
