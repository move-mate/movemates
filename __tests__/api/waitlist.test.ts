// import { NextResponse } from 'next/server';
// import { addToWaitlist } from '@/libs/waitlist';
// import { POST } from '@/app/api/waitlist/route';

// jest.mock('@/libs/waitlist', () => ({
//   addToWaitlist: jest.fn(),
// }));

// describe('POST /api/waitlist', () => {
//   afterEach(() => {
//     (addToWaitlist as jest.Mock).mockReset();
//   });

//   it('should add a new entry to the waitlist', async () => {
//     const mockBody = {
//       name: 'John Doe',
//       email: 'johndoe@example.com',
//       type: 'customer',
//       province: 'California',
//       city: 'Los Angeles',
//     };

//     (addToWaitlist as jest.Mock).mockResolvedValue({
//       id: 1,
//       ...mockBody,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     });

//     const request = {
//       json: () => Promise.resolve(mockBody),
//     } as any;

//     const response = await POST(request);

//     expect(addToWaitlist).toHaveBeenCalledWith(mockBody);
//     expect(response).toEqual(
//       NextResponse.json(
//         { message: 'Added to waitlist', data: expect.anything() },
//         { status: 201 }
//       )
//     );
//   });

//   it('should return a 400 Bad Request if the input is invalid', async () => {
//     const mockBody = {
//       email: 'johndoe@example.com',
//       type: 'customer',
//       province: 'California',
//       city: 'Los Angeles',
//     };

//     const request = {
//       json: () => Promise.resolve(mockBody),
//     } as any;

//     const response = await POST(request);

//     expect(addToWaitlist).not.toHaveBeenCalled();
//     expect(response).toEqual(
//       NextResponse.json({ errors: ['Name is required'] }, { status: 400 })
//     );
//   });

//   it('should return a 409 Conflict if the email already exists', async () => {
//     const mockBody = {
//       name: 'John Doe',
//       email: 'johndoe@example.com',
//       type: 'customer',
//       province: 'California',
//       city: 'Los Angeles',
//     };

//     (addToWaitlist as jest.Mock).mockRejectedValue({ code: '23505' });

//     const request = {
//       json: () => Promise.resolve(mockBody),
//     } as any;

//     const response = await POST(request);

//     expect(addToWaitlist).toHaveBeenCalledWith(mockBody);
//     expect(response).toEqual(
//       NextResponse.json({ error: 'Email already exists in waitlist' }, { status: 409 })
//     );
//   });

//   it('should return a 500 Internal Server Error if an unknown error occurs', async () => {
//     const mockBody = {
//       name: 'John Doe',
//       email: 'johndoe@example.com',
//       type: 'customer',
//       province: 'California',
//       city: 'Los Angeles',
//     };

//     (addToWaitlist as jest.Mock).mockRejectedValue(new Error('Unknown error'));

//     const request = {
//       json: () => Promise.resolve(mockBody),
//     } as any;

//     const response = await POST(request);

//     expect(addToWaitlist).toHaveBeenCalledWith(mockBody);
//     expect(response).toEqual(
//       NextResponse.json({ error: 'Internal server error' }, { status: 500 })
//     );
//   });
// });
